import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PostEntity } from '../entities/post.entity';
import { CreatePostDto, UpdatePostDto } from 'src/controllers/post.dto';
import { Repository } from 'typeorm';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(PostEntity)
    private postRepository: Repository<PostEntity>,
  ) {}

  //   async createPost(createPostDto: CreatePostDto): Promise<PostEntity> {
  //     const post = this.postRepository.create(createPostDto);
  //     return await this.postRepository.save(post);
  //   }

  async createPost(createPostDto: CreatePostDto): Promise<PostEntity> {
    const newPost = this.postRepository.create(createPostDto);
    await this.postRepository.save(newPost);
    return newPost;
  }

  async getAllPosts(): Promise<PostEntity[]> {
    return await this.postRepository.find();
  }

  async getPostById(id: number): Promise<PostEntity> {
    return await this.postRepository.findOne({ where: { id: id } });
  }

  async updatePost(
    id: number,
    updatePostDto: UpdatePostDto,
  ): Promise<PostEntity> {
    await this.postRepository.update(id, updatePostDto);
    return this.getPostById(id);
  }

  async deletePost(id: number): Promise<void> {
    await this.postRepository.delete(id);
  }
}
