import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ArticleDocument = Article & Document;

@Schema()
export class Article {
  @Prop({ required: true }) title: string;
  @Prop({ required: true }) authors: string;
  @Prop() journal: string;
  @Prop() year: number;
  @Prop() volume?: string;
  @Prop() number?: string;
  @Prop() pages?: string;
  @Prop() doi?: string;
  @Prop() bibtex?: string;
  @Prop({ type: Boolean, default: false }) approved: boolean;
  @Prop({ type: Boolean, default: false }) rejected: boolean;
  @Prop({ required: true }) username: string; 
}

export const ArticleSchema = SchemaFactory.createForClass(Article);