import {MessageHeader} from 'mozilla-webext-types';
import {FindnowOptions} from './Types/FindnowOptions';

export type SendMessageEditSubject = {
    header: MessageHeader;
    settings: FindnowOptions;
    file: string;
};