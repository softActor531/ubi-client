"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// 3p
// import { Group, Permission } from '@foal/typeorm';
// import { isCommon } from '@foal/password';
const typeorm_1 = require("typeorm");
// App
const entities_1 = require("../app/entities");
exports.schema = {
    additionalProperties: false,
    properties: {
    // email: { type: 'string', format: 'email' },
    // groups: { type: 'array', items: { type: 'string' }, uniqueItems: true, default: [] },
    // password: { type: 'string' },
    // userPermissions: { type: 'array', items: { type: 'string' }, uniqueItems: true, default: [] },
    },
    required: [ /* 'email', 'password' */],
    type: 'object',
};
async function main( /*args*/) {
    const user = new entities_1.User();
    // user.userPermissions = [];
    // user.groups = [];
    // user.email = args.email;
    // if (await isCommon(args.password)) {
    //   console.log('This password is too common. Please choose another one.');
    //   return;
    // }
    // await user.setPassword(args.password);
    await typeorm_1.createConnection();
    // for (const codeName of args.userPermissions as string[]) {
    //   const permission = await getRepository(Permission).findOne({ codeName });
    //   if (!permission) {
    //     console.log(`No permission with the code name "${codeName}" was found.`);
    //     return;
    //   }
    //   user.userPermissions.push(permission);
    // }
    // for (const codeName of args.groups as string[]) {
    //   const group = await getRepository(Group).findOne({ codeName });
    //   if (!group) {
    //     console.log(`No group with the code name "${codeName}" was found.`);
    //     return;
    //   }
    //   user.groups.push(group);
    // }
    try {
        console.log(await typeorm_1.getManager().save(user));
    }
    catch (error) {
        console.log(error.message);
    }
    finally {
        await typeorm_1.getConnection().close();
    }
}
exports.main = main;
//# sourceMappingURL=create-user.js.map