"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const inversify_1 = require("inversify");
const UserRepository_1 = require("../../src/repositories/UserRepository");
let UserRepositoryTest = class UserRepositoryTest {
    run() {
        return __awaiter(this, void 0, void 0, function* () {
            let adminEntities = yield this.userRepository.find({ code: 'admin' });
            console.log('[UserRepositoryTest] --------------------------------------------------------------------------------');
            console.log(`FOUND ${adminEntities.length} entities for with 'admin'`, JSON.stringify(adminEntities));
            if (adminEntities.length <= 0) {
                const newEntity = yield this.userRepository.save({
                    code: "105410413518993678241",
                    name: "Thanh Pham",
                    profiles: {
                        google: { kind: 'plus#person',
                            etag: '"Sh4n9u6EtD24TM0RmWv7jTXojqc/87ol5KDxmK8CsRarI8jWqW4UiGc"',
                            gender: 'male',
                            emails: [[Object]],
                            objectType: 'person',
                            id: '105410413518993678241',
                            displayName: 'Thanh Pham',
                            name: { familyName: 'Pham', givenName: 'Thanh' },
                            url: 'https://plus.google.com/105410413518993678241',
                            image: { url: 'https://lh4.googleusercontent.com/-1N0THctxyq4/AAAAAAAAAAI/AAAAAAAAEXg/Yp7klQFIs9k/photo.jpg?sz=50', isDefault: false },
                            organizations: [
                                {
                                    name: "Hanoi University of Technology",
                                    type: "school",
                                    primary: false
                                },
                                {
                                    name: "Onenet",
                                    title: "Vice Technical Diretor",
                                    type: "work",
                                    primary: false
                                }
                            ],
                            placesLived: [
                                {
                                    value: "Hanoi",
                                    primary: true
                                }
                            ],
                            isPlusUser: true,
                            language: 'en',
                            circledByCount: 14,
                            verified: false
                        },
                        facebook: {
                            name: 'Thanh Pham',
                            id: '1992054124144417'
                        }
                    }
                });
                console.log('[UserRepositoryTest] --------------------------------------------------------------------------------');
                console.log('INSERTED', JSON.stringify(newEntity));
                adminEntities = yield this.userRepository.find({ code: '105410413518993678241' });
                console.log('[UserRepositoryTest] --------------------------------------------------------------------------------');
                console.log(`FOUND ${adminEntities.length} entities for with 'admin'`, JSON.stringify(adminEntities));
            }
            const id = adminEntities[adminEntities.length - 1]._id;
            const entityById = yield this.userRepository.findOneById(id);
            console.log('[UserRepositoryTest] --------------------------------------------------------------------------------');
            console.log(`FOUND by id ${id}`, JSON.stringify(entityById));
            entityById.name = "Thanh.Pham @" + new Date().toString();
            yield this.userRepository.save(entityById);
            console.log('[UserRepositoryTest] --------------------------------------------------------------------------------');
            console.log(`UDPATED`, JSON.stringify(entityById));
            if (adminEntities.length > 1) {
                var removedEntity = yield this.userRepository.remove(adminEntities[0]);
                console.log('[UserRepositoryTest] --------------------------------------------------------------------------------');
                console.log(`REMOVED`, JSON.stringify(removedEntity));
            }
        });
    }
};
__decorate([
    inversify_1.inject(UserRepository_1.UserRepositoryTYPE),
    __metadata("design:type", Object)
], UserRepositoryTest.prototype, "userRepository", void 0);
UserRepositoryTest = __decorate([
    inversify_1.injectable()
], UserRepositoryTest);
exports.UserRepositoryTest = UserRepositoryTest;
