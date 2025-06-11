import { Controller, Post, Get, Body, Query, Param } from '@nestjs/common';
import { ArticlesService } from './articles.service';
import { CreateArticleDto } from './dto/create-article.dto';

@Controller('articles')
export class ArticlesController {
  constructor(private readonly articlesService: ArticlesService) {}

  // Upload a new article
  @Post('upload')
  async upload(@Body() data: CreateArticleDto & { username?: string }) {
    const username = data.username ?? 'anonymous';
    return this.articlesService.create({ ...data, username });
  }

  // Get all articles by a specific user
  @Get('my')
  async getMyArticles(@Query('username') username: string) {
    if (!username) return [];
    return this.articlesService.findByUsername(username);
  }

  // Search articles by keyword
  @Get('search')
  async search(@Query('keyword') keyword: string) {
    if (!keyword) return [];
    return this.articlesService.search(keyword);
  }

  // Get all articles pending review
  @Get('pending')
  async getPendingArticles() {
    return this.articlesService.findPending();
  }

  // Review an article (approve or reject)
  @Post('review/:id')
  async review(@Param('id') id: string, @Body() body: { approve: boolean }) {
    return this.articlesService.review(id, body.approve);
  }

  // Get article by ID
  @Get(':id')
  async getById(@Param('id') id: string) {
    return this.articlesService.findById(id);
  }
}