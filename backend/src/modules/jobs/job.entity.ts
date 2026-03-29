import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class JobEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  productId: number;
  
  @Column()
  status: string; // pending, completed, failed

  @Column({ nullable: true })
  result: string;

  @Column({ nullable: true })
  error: string;
}