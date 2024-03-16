import {
  BadRequestException,
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { UploadService } from './upload.service';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBadRequestResponse, ApiBearerAuth, ApiBody,
  ApiConsumes,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { Auth } from '../auth/decorators';
import { Permissions } from '../helpers/constants';

@Controller({
  path: 'uploads',
  version: '1',
})
@ApiTags('Uploads')
export class UploadsController {
  constructor(private readonly uploadService: UploadService) {}
  @Post('image')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Upload Image',
  })
  @ApiBody({
    type: 'file', // Specify that it's a file type
    schema: {
      type: 'object',
      properties: {
        image: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @ApiConsumes('multipart/form-data')
  @ApiCreatedResponse({
    description: 'The image has been uploaded successfully.',
  })
  @ApiBadRequestResponse({
    description: 'Bad Request',
    schema: {
      oneOf: [
        {
          type: 'object',
          properties: {
            message: { type: 'string', example: 'No file was provided.' },
          },
        },
        {
          type: 'object',
          properties: {
            message: {
              type: 'string',
              example: 'Invalid file type. Only images are allowed.',
            },
          },
        },
        {
          type: 'object',
          properties: {
            message: {
              type: 'string',
              example: 'File size exceeds the limit of 4MB.',
            },
          },
        },
      ],
    },
  })
  @Auth(Permissions.MANAGE_RAFFLE)
  @UseInterceptors(FileInterceptor('image'))
  async uploadImage(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('No file uploaded.');
    }

    return this.uploadService.uploadImage(file);
  }
}
