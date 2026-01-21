import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm";
import { ChecklistEntity } from "./checklist.entity";

@Entity({ name: "checklist_item" })
export class ChecklistItemEntity {
        @PrimaryGeneratedColumn("uuid")
        id: string;

        @Column({
                name: "title",
                type: "varchar",
                length: 40
        })
        title: string;

        @Column({
                name: "is_completed",
                type: "boolean",
                default: false
        })
        isCompleted: boolean;

        @Column({
                name: "checklist_id",
                type: "uuid",
                nullable: false
        })
        checklistId: string;

        @Column({
                name: "created_at",
                type: "bigint",
                nullable: false
        })
        createdAt: bigint;

        @Column({
                name: "updated_at",
                type: "bigint",
                nullable: true
        })
        updatedAt?: bigint;

        @ManyToOne(() => ChecklistEntity, (checklist) => checklist.checklistItems, { onDelete: "CASCADE" })
        @JoinColumn({ name: "checklist_id" })
        checklist: ChecklistEntity;
}
