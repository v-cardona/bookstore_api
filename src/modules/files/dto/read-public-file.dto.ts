import { Exclude, Expose,  } from "class-transformer";
import { IsUrl } from "class-validator";
import { ApiProperty } from '@nestjs/swagger';

@Exclude()
export class ReadPublicFilerDto {
    @Expose()
    @IsUrl()
    @ApiProperty({example: 'https://firebasestorage.googleapis.com/image.png'})
    readonly url: string;
    
}