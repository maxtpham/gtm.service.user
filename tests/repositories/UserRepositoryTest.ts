import config from './../../src/config/AppConfig';
import { inject, injectable } from 'inversify';

import { UserEntity } from '../../src/entities/UserEntity';
import { UserRepository, UserRepositoryTYPE } from '../../src/repositories/UserRepository';

@injectable()
export class UserRepositoryTest {
    @inject(UserRepositoryTYPE)
    private userRepository: UserRepository;

    public async run() {
        let adminEntities = await this.userRepository.find({ code: 'admin' });
        console.log('[UserRepositoryTest] --------------------------------------------------------------------------------');
        console.log(`FOUND ${adminEntities.length} entities for with 'admin'`, JSON.stringify(adminEntities));

        if (adminEntities.length <= 0) {
            const newEntity = await this.userRepository.save(<UserEntity>
                {
                    code: "105410413518993678241",
                    name: "Thanh Pham",
                    profiles: {
                        google: { kind: 'plus#person',
                        etag: '"Sh4n9u6EtD24TM0RmWv7jTXojqc/87ol5KDxmK8CsRarI8jWqW4UiGc"',
                        gender: 'male',
                        emails: [ [Object] ],
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
                        }],
                        isPlusUser: true,
                        language: 'en',
                        circledByCount: 14,
                        verified: false
                    },
                    facebook: {
                        name: 'Thanh Pham',
                        id: '1992054124144417'
                    }
                }}            
            );
            console.log('[UserRepositoryTest] --------------------------------------------------------------------------------');
            console.log('INSERTED', JSON.stringify(newEntity));

            adminEntities = await this.userRepository.find({ code: '105410413518993678241' });
            console.log('[UserRepositoryTest] --------------------------------------------------------------------------------');
            console.log(`FOUND ${adminEntities.length} entities for with 'admin'`, JSON.stringify(adminEntities));
        }
        
        const id = adminEntities[adminEntities.length - 1]._id;
        const entityById = await this.userRepository.findOneById(id);
        console.log('[UserRepositoryTest] --------------------------------------------------------------------------------');
        console.log(`FOUND by id ${id}`, JSON.stringify(entityById));

        entityById.name = "Thanh.Pham @" + new Date().toString();
        await this.userRepository.save(entityById)
        console.log('[UserRepositoryTest] --------------------------------------------------------------------------------');
        console.log(`UDPATED`, JSON.stringify(entityById));

        if (adminEntities.length > 1) {
            var removedEntity = await this.userRepository.remove(adminEntities[0]);
            console.log('[UserRepositoryTest] --------------------------------------------------------------------------------');
            console.log(`REMOVED`, JSON.stringify(removedEntity));
        }
    }
}
