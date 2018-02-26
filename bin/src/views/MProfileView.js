"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var UserProfile;
(function (UserProfile) {
    function toProfileViews(entity) {
        let profilesList = [];
        entity.forEach((item) => {
            let profiles = {
                id: item._id,
                name: item.name,
                roles: item.roles,
                active: item.active,
                birthday: item.birthday,
                address: item.address,
                location: item.location,
                phone: item.phone,
                email: item.email,
                language: item.email,
                gender: item.gender,
                timezone: item.timezone,
            };
            profilesList.push(profiles);
        });
        return profilesList;
    }
    UserProfile.toProfileViews = toProfileViews;
    function toProfileView(item) {
        let profiles = {
            id: item._id,
            name: item.name,
            roles: item.roles,
            active: item.active,
            birthday: item.birthday,
            address: item.address,
            location: item.location,
            phone: item.phone,
            email: item.email,
            language: item.email,
            gender: item.gender,
            timezone: item.timezone,
        };
        return profiles;
    }
    UserProfile.toProfileView = toProfileView;
})(UserProfile = exports.UserProfile || (exports.UserProfile = {}));
