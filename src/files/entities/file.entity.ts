import { BaseEntity, Column, CreateDateColumn, Entity, Generated, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity('files')
export class File extends BaseEntity{
    @PrimaryGeneratedColumn('uuid')
    uuid!: string;

    @Column()
    filename!: string;

    @Column()
    path!: string;

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;
}
