import fs from 'fs'
import {MigrationInterface, QueryRunner} from "typeorm"

const days_in_month = fs.readFileSync(__dirname + '/../../schema/days_in_month.sql').toString()
const generate_recurrences = fs.readFileSync(__dirname + '/../../schema/generate_recurrences.sql').toString()
const interval_for = fs.readFileSync(__dirname + '/../../schema/interval_for.sql').toString()
const intervals_between = fs.readFileSync(__dirname + '/../../schema/intervals_between.sql').toString()
const recurrences_for = fs.readFileSync(__dirname + '/../../schema/recurrences_for.sql').toString()
const recurring_appointments_for = fs.readFileSync(__dirname + '/../../schema/recurring_appointments_for.sql').toString()

export class recurringScripts1594962448045 implements MigrationInterface {
    name = 'recurringScripts1594962448045'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(days_in_month, undefined);
        await queryRunner.query(generate_recurrences, undefined);
        await queryRunner.query(interval_for, undefined);
        await queryRunner.query(intervals_between, undefined);
        await queryRunner.query(recurrences_for, undefined);
        await queryRunner.query(recurring_appointments_for, undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP FUNCTION recurring_appointments_for(range_start TIMESTAMP, range_end TIMESTAMP, time_zone CHARACTER VARYING, appointments_limit INT)`, undefined);
        await queryRunner.query(`DROP FUNCTION recurrences_for(evt appointment, range_start TIMESTAMP, range_end TIMESTAMP)`, undefined);
        await queryRunner.query(`DROP FUNCTION intervals_between(start_date DATE, end_date DATE, duration INTERVAL)`, undefined);
        await queryRunner.query(`DROP FUNCTION interval_for(recurs appointment_frequency_enum)`, undefined);
        await queryRunner.query(`DROP FUNCTION generate_recurrences(frequency VARCHAR, duration INTERVAL, original_start_date DATE, original_end_date DATE, range_start DATE, range_end DATE, repeat_month INT, repeat_week INT, repeat_day INT)`, undefined);
        await queryRunner.query(`DROP FUNCTION days_in_month(check_date DATE)`, undefined);
    }
}
