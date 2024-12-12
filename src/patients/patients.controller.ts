import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Put,
  Delete,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { PatientsService } from './patients.service';
import { CreatePatientDto } from './dto/create-patient.dto';
import { Logger } from '@nestjs/common';

@Controller('patients')
export class PatientsController {
  private readonly logger = new Logger(PatientsService.name);
  constructor(private readonly patientsService: PatientsService) {}

  @Post()
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  create(@Body() createPatientDto: CreatePatientDto) {
    console.log('Patients/create/conrtoller');
    return this.patientsService.create(createPatientDto);
  }

  @Get()
  findAll() {
    console.log('Patients/findAll/conrtoller');
    return this.patientsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    console.log('Patients/findOne/conrtoller');
    return this.patientsService.findOne(id);
  }

  @Put(':id')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  update(
    @Param('id') id: string,
    @Body() updateDto: Partial<CreatePatientDto>,
  ) {
    console.log('Patients/update/conrtoller');
    return this.patientsService.update(id, updateDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    console.log('Patients/remove/conrtoller');
    return this.patientsService.remove(id);
  }
}
