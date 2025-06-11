import { Controller, Post, Get, Body, Query, Param } from '@nestjs/common';
import { ArticlesService } from './articles.service';
import { CreateArticleDto } from './dto/create-article.dto';

@Controller('articles')
export class ArticlesController {
  constructor(private readonly articlesService: ArticlesService) {}

  // 投稿接口
  @Post('upload')
  async upload(@Body() data: CreateArticleDto & { username?: string }) {
    const username = data.username ?? 'anonymous';
    return this.articlesService.create({ ...data, username });
  }

  // 查询我的投稿
  @Get('my')
  async getMyArticles(@Query('username') username: string) {
    if (!username) return [];
    return this.articlesService.findByUsername(username);
  }

  // 搜索
  @Get('search')
  async search(@Query('keyword') keyword: string) {
    if (!keyword) return [];
    return this.articlesService.search(keyword);
  }

  // 查询待审核
  @Get('pending')
  async getPendingArticles() {
    return this.articlesService.findPending();
  }

  // 审核通过/驳回
  @Post('review/:id')
  async review(@Param('id') id: string, @Body() body: { approve: boolean }) {
    return this.articlesService.review(id, body.approve);
  }

  // 文章详情
  @Get(':id')
  async getById(@Param('id') id: string) {
    return this.articlesService.findById(id);
  }
}