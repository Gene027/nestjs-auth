import { ApiProperty } from '@nestjs/swagger';

export class Profile {
  @ApiProperty({
    type: String,
  })
  name?: string | null;

  @ApiProperty({
    type: String,
  })
  githubUsername?: string | null;

  @ApiProperty({
    type: String,
  })
  dob?: string | null;
}
