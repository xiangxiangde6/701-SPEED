import { Test, TestingModule } from '@nestjs/testing';
import { ArticlesService } from './articles.service';
import { getModelToken } from '@nestjs/mongoose';
import { Article } from './schemas/article.schema';

describe('ArticlesService', () => {
  let service: ArticlesService;

  const mockArticleModel = {
    create: jest.fn().mockImplementation(dto => Promise.resolve({ _id: 'mockId', ...dto }))
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ArticlesService,
        {
          provide: getModelToken(Article.name),
          useValue: mockArticleModel
        }
      ]
    }).compile();

    service = module.get<ArticlesService>(ArticlesService);
  });

  it('should create an article without BibTeX', async () => {
    const articleData = {
      title: 'Test Title',
      authors: 'Author One',
      journal: 'Test Journal',
      year: 2024,
      username: 'testuser'
    };

    const result = await service.create(articleData);
    expect(result).toHaveProperty('_id');
    expect(mockArticleModel.create).toHaveBeenCalledWith({
      ...articleData,
      approved: false
    });
  });
});