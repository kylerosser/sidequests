"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.questsService = void 0;
const questModel_1 = __importDefault(require("../models/questModel"));
exports.questsService = {
    getQuestsWithinBounds: (bounds_1, ...args_1) => __awaiter(void 0, [bounds_1, ...args_1], void 0, function* (bounds, approvedOnly = true) {
        const query = {
            location: {
                $geoWithin: {
                    $box: bounds
                }
            }
        };
        if (approvedOnly) {
            query.moderatorApproved = true;
        }
        ;
        const foundQuests = yield questModel_1.default.find(query).populate('creator', { username: 1 });
        return foundQuests;
    }),
    findQuestById: (id) => __awaiter(void 0, void 0, void 0, function* () {
        return yield questModel_1.default.findById(id).populate('creator', { username: 1 });
    })
};
