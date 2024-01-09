import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
  UploadedFiles,
} from '@nestjs/common';
import { PostEntity } from '../entities/post.entity';
import { PostService } from '../services/post.service';
import { CreatePostDto, UpdatePostDto } from './post.dto';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { multerConfig } from '../config/multer.config';

@Controller('posts')
export class PostController {
  constructor(private readonly postService: PostService) {}

  //   @Post()
  //   create(@Body() createPostDto: CreatePostDto): Promise<PostEntity> {
  //     return this.postService.createPost(createPostDto);
  //   }

  // @Post()
  // @UseInterceptors(FileInterceptor('image', multerConfig))
  // async create(
  //   @UploadedFile() file: Express.Multer.File,
  //   @Body() createPostDto: CreatePostDto,
  // ): Promise<PostEntity> {
  //   if (file) {
  //     console.log('file', file.filename);
  //     createPostDto.image = `uploads/${file.filename}`;
  //   } else {
  //     console.log('No file uploaded');
  //   }

  //   return this.postService.createPost(createPostDto);
  // }

  @Post()
  @UseInterceptors(FilesInterceptor('image', 10, multerConfig)) // Adjust '10' to the max number of files
  async create(
    @UploadedFiles() files: Express.Multer.File[],
    @Body() createPostDto: CreatePostDto,
  ): Promise<PostEntity> {
    if (files && files.length > 0) {
      console.log('files:', files);
      createPostDto.image = files.map((file) => `uploads/${file.filename}`);
    } else {
      console.log('No files uploaded');
    }

    return this.postService.createPost(createPostDto);
  }

  @Get()
  getAll(): Promise<PostEntity[]> {
    return this.postService.getAllPosts();
  }

  @Get(':id')
  getById(@Param('id') id: number): Promise<PostEntity> {
    return this.postService.getPostById(id);
  }

  // @Put(':id')
  // update(
  //   @Param('id') id: number,
  //   @Body() updatePostDto: UpdatePostDto,
  // ): Promise<PostEntity> {
  //   return this.postService.updatePost(id, updatePostDto);
  // }

  // @Put(':id')
  // @UseInterceptors(FileInterceptor('image', multerConfig))
  // async update(
  //   @Param('id') id: number,
  //   @UploadedFile() file: Express.Multer.File,
  //   @Body() updatePostDto: UpdatePostDto,
  // ): Promise<PostEntity> {
  //   console.log('Start updating post', updatePostDto);

  //   if (file) {
  //     console.log(file, 'File for update detected!');
  //     try {
  //       const filePath = `uploads/${file.filename}`;
  //       // const fileStream = createWriteStream(`./${filePath}`);
  //       // fileStream.write(file.buffer);
  //       // fileStream.end();

  //       updatePostDto.image = filePath;
  //     } catch (error) {
  //       throw new BadRequestException('Error handling file upload');
  //     }
  //   } else {
  //     console.log('No file uploaded for update');
  //   }

  //   try {
  //     return await this.postService.updatePost(id, updatePostDto);
  //   } catch (error) {
  //     throw new BadRequestException('Error updating post');
  //   }
  // }

  @Put(':id')
  @UseInterceptors(FilesInterceptor('image', 10, multerConfig)) // Adjust '10' to the max number of files
  async update(
    @Param('id') id: number,
    @UploadedFiles() files: Express.Multer.File[],
    @Body() updatePostDto: UpdatePostDto,
  ): Promise<PostEntity> {
    console.log('Start updating post', updatePostDto);

    if (files && files.length > 0) {
      console.log('Files for update detected:', files);
      updatePostDto.image = files.map((file) => `uploads/${file.filename}`);
    } else {
      console.log('No files uploaded for update');
    }

    try {
      return await this.postService.updatePost(id, updatePostDto);
    } catch (error) {
      throw new BadRequestException('Error updating post');
    }
  }

  @Delete(':id')
  delete(@Param('id') id: number): Promise<void> {
    return this.postService.deletePost(id);
  }
}
