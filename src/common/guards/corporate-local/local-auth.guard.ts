import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class CorporateLocalAuthGuard extends AuthGuard('corporate-local') {}
