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

  // New article upload
  async create(data: CreateArticleDto & { username: string }): Promise<Article> {
    if (data.bibtex) {
      // Analyze bibtex format
      const parsed = this.parseBibtex(data.bibtex);

      // Ensure required fields are present
      if (!parsed.title || !parsed.authors) {
        throw new Error('BibTeX must include title and author fields');
      }

      return this.articleModel.create({
        ...data,
        ...parsed, // replace with parsed bibtex fields
        approved: false,
      });
    }

    // If no bibtex, use provided fields directly
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

  // Check if article exists by DOI
  async findByUsername(username: string): Promise<Article[]> {
    return this.articleModel.find({ username }).exec();
  }

  // Search articles by keyword
  async search(keyword: string): Promise<Article[]> {
    const q = {
      approved: true, // only search approved articles
      $or: [
        { title: { $regex: keyword, $options: 'i' } },
        { authors: { $regex: keyword, $options: 'i' } },
        { journal: { $regex: keyword, $options: 'i' } },
        { doi: { $regex: keyword, $options: 'i' } }
      ]
    };
    return this.articleModel.find(q).exec();
  }

  // Find all articles pending review
  async findPending(): Promise<Article[]> {
  return this.articleModel.find({ approved: false, rejected: { $ne: true } }).exec();
}

  // Review an article (approve or reject)
  async review(id: string, approve: boolean) {
  if (approve) {
    return this.articleModel.findByIdAndUpdate(id, { approved: true, rejected: false }, { new: true }).exec();
  } else {
    return this.articleModel.findByIdAndUpdate(id, { approved: false, rejected: true }, { new: true }).exec();
  }
}

  // Find article by ID
  async findById(id: string): Promise<Article | null> {
    return this.articleModel.findById(id).exec();
  }
}