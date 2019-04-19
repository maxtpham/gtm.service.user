"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function toDateReadable(ticks) {
    if (typeof (ticks) !== 'number')
        return '';
    const date = new Date(ticks);
    return date.getFullYear() + '-' + (date.getMonth() >= 9 ? (date.getMonth() + 1) : ('0' + (date.getMonth() + 1))) + '-' + (date.getDate() >= 10 ? date.getDate() : ('0' + date.getDate()));
}
exports.toDateReadable = toDateReadable;
