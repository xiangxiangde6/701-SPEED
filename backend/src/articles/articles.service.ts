import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Article, ArticleDocument } from './schemas/article.schema';
import { CreateArticleDto } from './dto/create-article.dto';

@Injectable()
export class ArticlesService {
  constructor(
    @InjectModel(Article.name)
    private articleModel: Model<ArticleDocument>,
  ) {}

  // 新增投稿，支持结构化和 BibTeX
  async create(data: CreateArticleDto & { username: string }): Promise<Article> {
    if (data.bibtex) {
      // 解析 bibtex，提取必填字段
      const parsed = this.parseBibtex(data.bibtex);

      // 确保 title 和 authors 存在，否则抛出错误
      if (!parsed.title || !parsed.authors) {
        throw new Error('BibTeX must include title and author fields');
      }

      return this.articleModel.create({
        ...data,
        ...parsed, // 将解析的字段覆盖进来
        approved: false,
      });
    }
    // 非 bibtex 上传，直接保存
    return this.articleModel.create({
      ...data,
      approved: false,
    });
  }

  private parseBibtex(bibtex: string) {
    const title = this.extractField(bibtex, 'title');
    const authors = this.extractField(bibtex, 'author');
    const journal = this.extractField(bibtex, 'journal');
    const yearStr = this.extractField(bibtex, 'year');
    const year = yearStr ? Number(yearStr) : undefined;
    const doi = this.extractField(bibtex, 'doi');

    return { title, authors, journal, year, doi };
  }

  private extractField(text: string, field: string): string {
    const regex = new RegExp(`${field}\\s*=\\s*[{\"]([^}\"]+)[}\"]`, 'i');
    const match = text.match(regex);
    return match ? match[1].trim() : '';
  }

  // 查询某用户所有投稿
  async findByUsername(username: string): Promise<Article[]> {
    return this.articleModel.find({ username }).exec();
  }

  // 搜索
  async search(keyword: string): Promise<Article[]> {
    const q = {
      approved: true, // 只搜索已审核的文章
      $or: [
        { title: { $regex: keyword, $options: 'i' } },
        { authors: { $regex: keyword, $options: 'i' } },
        { journal: { $regex: keyword, $options: 'i' } },
        { doi: { $regex: keyword, $options: 'i' } }
      ]
    };
    return this.articleModel.find(q).exec();
  }

  // 查询所有未审核
  async findPending(): Promise<Article[]> {
  return this.articleModel.find({ approved: false, rejected: { $ne: true } }).exec();
}

  // 审核通过/驳回
  async review(id: string, approve: boolean) {
  if (approve) {
    return this.articleModel.findByIdAndUpdate(id, { approved: true, rejected: false }, { new: true }).exec();
  } else {
    return this.articleModel.findByIdAndUpdate(id, { approved: false, rejected: true }, { new: true }).exec();
  }
}

  // 按ID查详情
  async findById(id: string): Promise<Article | null> {
    return this.articleModel.findById(id).exec();
  }
}