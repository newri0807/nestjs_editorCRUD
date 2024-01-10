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
import * as multer from 'multer';

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
  @UseInterceptors(FilesInterceptor('image', 10))
  async create(
    @UploadedFiles() files: Express.Multer.File[],
    @Body() createPostDto: CreatePostDto,
  ) {
    // 파일이 업로드되면, files 배열은 업로드된 파일에 대한 정보를 포함
    if (files && files.length > 0) {
      // 업로드된 파일들을 처리하는 로직
      console.log('Uploaded files:', files);

      createPostDto.image = files.map(
        (file) =>
          `https://editor-blogs.s3.ap-northeast-2.amazonaws.com/cis/${file.originalname}`,
      ); // 'location'은 S3 URL
    } else {
      console.log('No files uploaded');
    }

    // 나머지 비즈니스 로직 수행
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
  @UseInterceptors(FilesInterceptor('image', 10))
  async update(
    @Param('id') id: number,
    @UploadedFiles() files: Express.Multer.File[], // files는 업로드된 파일의 배열
    @Body() updatePostDto: UpdatePostDto,
  ): Promise<PostEntity> {
    console.log('Start updating post', updatePostDto);

    if (files && files.length > 0) {
      const uploadedImages = files.map(
        (file) =>
          `https://editor-blogs.s3.ap-northeast-2.amazonaws.com/cis/${file.originalname}`,
      ); // S3 URL
      console.log('Files for update detected:', uploadedImages);
      updatePostDto.image = uploadedImages; // 'image' 필드에 URL 배열 저장
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
