import {MigrationInterface, QueryRunner} from "typeorm";

export class initialSchema1597064077364 implements MigrationInterface {
    name = 'initialSchema1597064077364'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "token" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "type" text NOT NULL, "ttl" integer NOT NULL, "used" boolean NOT NULL DEFAULT false, "userId" uuid NOT NULL, CONSTRAINT "PK_82fae97f905930df5d62a702fc9" PRIMARY KEY ("id"))`, undefined);
        await queryRunner.query(`CREATE TABLE "event" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAat" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "name" text NOT NULL, "location" text, "description" text, "organizationId" uuid NOT NULL, CONSTRAINT "PK_30c2f3bbaf6d34a55f8ae6e4614" PRIMARY KEY ("id"))`, undefined);
        await queryRunner.query(`CREATE TABLE "organization" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "name" text NOT NULL, "portalName" text NOT NULL, "website" text, "timezone" text NOT NULL, "streetAddress" text, "streetAddress2" text, "city" text, "state" text, "postalCode" text, "country" text, "phoneNumber" text, "mobileNumber" text, "faxNumber" text, "notes" text, "billingPrimaryEmail" text, "billingOrgName" text, "billingPurchaseOrderNumber" text, "billingAttentionTo" text, "billingAddress" text, "billingAddress2" text, "billingCity" text, "billingState" text, "billingPostalCode" text, "billingCountry" text, "ownerId" uuid, CONSTRAINT "UQ_c21e615583a3ebbb0977452afb0" UNIQUE ("name"), CONSTRAINT "REL_67c515257c7a4bc221bb1857a3" UNIQUE ("ownerId"), CONSTRAINT "PK_472c1f99a32def1b0abb219cd67" PRIMARY KEY ("id"))`, undefined);
        await queryRunner.query(`CREATE INDEX "IDX_c21e615583a3ebbb0977452afb" ON "organization" ("name") `, undefined);
        await queryRunner.query(`CREATE TYPE "user_role_enum" AS ENUM('admin', 'manager', 'member')`, undefined);
        await queryRunner.query(`CREATE TABLE "user" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "firstName" text NOT NULL, "lastName" text NOT NULL, "email" text NOT NULL, "passwordHash" text NOT NULL, "verifiedDate" TIMESTAMP WITH TIME ZONE DEFAULT null, "role" "user_role_enum" NOT NULL DEFAULT 'member', CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`, undefined);
        await queryRunner.query(`CREATE INDEX "IDX_58e4dbff0e1a32a9bdc861bb29" ON "user" ("firstName") `, undefined);
        await queryRunner.query(`CREATE INDEX "IDX_f0e1b4ecdca13b177e2e3a0613" ON "user" ("lastName") `, undefined);
        await queryRunner.query(`CREATE INDEX "IDX_e12875dfb3b1d92d7d7c5377e2" ON "user" ("email") `, undefined);
        await queryRunner.query(`CREATE TABLE "feedback" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "serviceRating" integer NOT NULL, "techRating" integer NOT NULL, "comments" text, "sessionId" uuid NOT NULL, CONSTRAINT "PK_8389f9e087a57689cd5be8b2b13" PRIMARY KEY ("id"))`, undefined);
        await queryRunner.query(`CREATE TYPE "session_status_enum" AS ENUM('ready', 'no_show', 'completed', 'canceled')`, undefined);
        await queryRunner.query(`CREATE TABLE "session" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "status" "session_status_enum" NOT NULL DEFAULT 'ready', "date" date NOT NULL, "transcriptReady" boolean NOT NULL DEFAULT false, "transcript" text, "editedTranscriptReady" boolean NOT NULL DEFAULT false, "editedTranscript" text, "summaryReady" boolean NOT NULL DEFAULT false, "summary" text, "audioReady" boolean NOT NULL DEFAULT false, "audioUrl" text, "staffNotes" text, "noShow" boolean NOT NULL DEFAULT false, "isBilled" boolean NOT NULL DEFAULT false, "appointmentId" uuid NOT NULL, CONSTRAINT "PK_f55da76ac1c3ac420f444d2ff11" PRIMARY KEY ("id"))`, undefined);
        await queryRunner.query(`CREATE TYPE "appointment_status_enum" AS ENUM('created', 'pending', 'waiting', 'confirmed', 'completed', 'canceled')`, undefined);
        await queryRunner.query(`CREATE TABLE "appointment" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "status" "appointment_status_enum" NOT NULL DEFAULT 'created', "startDate" TIMESTAMP WITH TIME ZONE NOT NULL, "endDate" TIMESTAMP WITH TIME ZONE NOT NULL, "title" text, "allDay" boolean NOT NULL DEFAULT false, "rrule" text, "exDate" text, "notes" text, "timezone" text NOT NULL DEFAULT 'Etc/UTC', "eventId" uuid NOT NULL, CONSTRAINT "PK_e8be1a53027415e709ce8a2db74" PRIMARY KEY ("id"))`, undefined);
        await queryRunner.query(`CREATE TABLE "event_users_user" ("eventId" uuid NOT NULL, "userId" uuid NOT NULL, CONSTRAINT "PK_ed194d1b2bd458933bdcd2cc81d" PRIMARY KEY ("eventId", "userId"))`, undefined);
        await queryRunner.query(`CREATE INDEX "IDX_ddfe947d856e921a02d7ab2369" ON "event_users_user" ("eventId") `, undefined);
        await queryRunner.query(`CREATE INDEX "IDX_a79703c5a43b536a49e3e4713e" ON "event_users_user" ("userId") `, undefined);
        await queryRunner.query(`CREATE TABLE "organization_users_user" ("organizationId" uuid NOT NULL, "userId" uuid NOT NULL, CONSTRAINT "PK_a0057ab2ced35777f00eaaa9673" PRIMARY KEY ("organizationId", "userId"))`, undefined);
        await queryRunner.query(`CREATE INDEX "IDX_e1e28e472b43bbad7ff3cecdcd" ON "organization_users_user" ("organizationId") `, undefined);
        await queryRunner.query(`CREATE INDEX "IDX_a02d820429038dce37d18f74b6" ON "organization_users_user" ("userId") `, undefined);
        await queryRunner.query(`CREATE TABLE "appointment_users_user" ("appointmentId" uuid NOT NULL, "userId" uuid NOT NULL, CONSTRAINT "PK_6b74aed83e5db9e97d9434a2e57" PRIMARY KEY ("appointmentId", "userId"))`, undefined);
        await queryRunner.query(`CREATE INDEX "IDX_6075a79518f01eb8233144c067" ON "appointment_users_user" ("appointmentId") `, undefined);
        await queryRunner.query(`CREATE INDEX "IDX_88ac9bb2d40d6cafc6fa896efb" ON "appointment_users_user" ("userId") `, undefined);
        await queryRunner.query(`ALTER TABLE "token" ADD CONSTRAINT "FK_94f168faad896c0786646fa3d4a" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`, undefined);
        await queryRunner.query(`ALTER TABLE "event" ADD CONSTRAINT "FK_4db6d1ac45a58cb20e01ea9699c" FOREIGN KEY ("organizationId") REFERENCES "organization"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`, undefined);
        await queryRunner.query(`ALTER TABLE "organization" ADD CONSTRAINT "FK_67c515257c7a4bc221bb1857a39" FOREIGN KEY ("ownerId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`, undefined);
        await queryRunner.query(`ALTER TABLE "feedback" ADD CONSTRAINT "FK_f1f85e7ceeea8bb5658be8ff0ac" FOREIGN KEY ("sessionId") REFERENCES "session"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`, undefined);
        await queryRunner.query(`ALTER TABLE "session" ADD CONSTRAINT "FK_18baa889dba673775808c66ca45" FOREIGN KEY ("appointmentId") REFERENCES "appointment"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`, undefined);
        await queryRunner.query(`ALTER TABLE "appointment" ADD CONSTRAINT "FK_18a4830d19b3002dff66ab8d92c" FOREIGN KEY ("eventId") REFERENCES "event"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`, undefined);
        await queryRunner.query(`ALTER TABLE "event_users_user" ADD CONSTRAINT "FK_ddfe947d856e921a02d7ab2369e" FOREIGN KEY ("eventId") REFERENCES "event"("id") ON DELETE CASCADE ON UPDATE NO ACTION`, undefined);
        await queryRunner.query(`ALTER TABLE "event_users_user" ADD CONSTRAINT "FK_a79703c5a43b536a49e3e4713ea" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`, undefined);
        await queryRunner.query(`ALTER TABLE "organization_users_user" ADD CONSTRAINT "FK_e1e28e472b43bbad7ff3cecdcdd" FOREIGN KEY ("organizationId") REFERENCES "organization"("id") ON DELETE CASCADE ON UPDATE NO ACTION`, undefined);
        await queryRunner.query(`ALTER TABLE "organization_users_user" ADD CONSTRAINT "FK_a02d820429038dce37d18f74b68" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`, undefined);
        await queryRunner.query(`ALTER TABLE "appointment_users_user" ADD CONSTRAINT "FK_6075a79518f01eb8233144c0671" FOREIGN KEY ("appointmentId") REFERENCES "appointment"("id") ON DELETE CASCADE ON UPDATE NO ACTION`, undefined);
        await queryRunner.query(`ALTER TABLE "appointment_users_user" ADD CONSTRAINT "FK_88ac9bb2d40d6cafc6fa896efb8" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`, undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "appointment_users_user" DROP CONSTRAINT "FK_88ac9bb2d40d6cafc6fa896efb8"`, undefined);
        await queryRunner.query(`ALTER TABLE "appointment_users_user" DROP CONSTRAINT "FK_6075a79518f01eb8233144c0671"`, undefined);
        await queryRunner.query(`ALTER TABLE "organization_users_user" DROP CONSTRAINT "FK_a02d820429038dce37d18f74b68"`, undefined);
        await queryRunner.query(`ALTER TABLE "organization_users_user" DROP CONSTRAINT "FK_e1e28e472b43bbad7ff3cecdcdd"`, undefined);
        await queryRunner.query(`ALTER TABLE "event_users_user" DROP CONSTRAINT "FK_a79703c5a43b536a49e3e4713ea"`, undefined);
        await queryRunner.query(`ALTER TABLE "event_users_user" DROP CONSTRAINT "FK_ddfe947d856e921a02d7ab2369e"`, undefined);
        await queryRunner.query(`ALTER TABLE "appointment" DROP CONSTRAINT "FK_18a4830d19b3002dff66ab8d92c"`, undefined);
        await queryRunner.query(`ALTER TABLE "session" DROP CONSTRAINT "FK_18baa889dba673775808c66ca45"`, undefined);
        await queryRunner.query(`ALTER TABLE "feedback" DROP CONSTRAINT "FK_f1f85e7ceeea8bb5658be8ff0ac"`, undefined);
        await queryRunner.query(`ALTER TABLE "organization" DROP CONSTRAINT "FK_67c515257c7a4bc221bb1857a39"`, undefined);
        await queryRunner.query(`ALTER TABLE "event" DROP CONSTRAINT "FK_4db6d1ac45a58cb20e01ea9699c"`, undefined);
        await queryRunner.query(`ALTER TABLE "token" DROP CONSTRAINT "FK_94f168faad896c0786646fa3d4a"`, undefined);
        await queryRunner.query(`DROP INDEX "IDX_88ac9bb2d40d6cafc6fa896efb"`, undefined);
        await queryRunner.query(`DROP INDEX "IDX_6075a79518f01eb8233144c067"`, undefined);
        await queryRunner.query(`DROP TABLE "appointment_users_user"`, undefined);
        await queryRunner.query(`DROP INDEX "IDX_a02d820429038dce37d18f74b6"`, undefined);
        await queryRunner.query(`DROP INDEX "IDX_e1e28e472b43bbad7ff3cecdcd"`, undefined);
        await queryRunner.query(`DROP TABLE "organization_users_user"`, undefined);
        await queryRunner.query(`DROP INDEX "IDX_a79703c5a43b536a49e3e4713e"`, undefined);
        await queryRunner.query(`DROP INDEX "IDX_ddfe947d856e921a02d7ab2369"`, undefined);
        await queryRunner.query(`DROP TABLE "event_users_user"`, undefined);
        await queryRunner.query(`DROP TABLE "appointment"`, undefined);
        await queryRunner.query(`DROP TYPE "appointment_status_enum"`, undefined);
        await queryRunner.query(`DROP TABLE "session"`, undefined);
        await queryRunner.query(`DROP TYPE "session_status_enum"`, undefined);
        await queryRunner.query(`DROP TABLE "feedback"`, undefined);
        await queryRunner.query(`DROP INDEX "IDX_e12875dfb3b1d92d7d7c5377e2"`, undefined);
        await queryRunner.query(`DROP INDEX "IDX_f0e1b4ecdca13b177e2e3a0613"`, undefined);
        await queryRunner.query(`DROP INDEX "IDX_58e4dbff0e1a32a9bdc861bb29"`, undefined);
        await queryRunner.query(`DROP TABLE "user"`, undefined);
        await queryRunner.query(`DROP TYPE "user_role_enum"`, undefined);
        await queryRunner.query(`DROP INDEX "IDX_c21e615583a3ebbb0977452afb"`, undefined);
        await queryRunner.query(`DROP TABLE "organization"`, undefined);
        await queryRunner.query(`DROP TABLE "event"`, undefined);
        await queryRunner.query(`DROP TABLE "token"`, undefined);
    }

}
