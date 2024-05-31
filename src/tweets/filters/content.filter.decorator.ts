import {Injectable, OnModuleInit} from '@nestjs/common';
import {TweetsService} from '../tweets.service';
import {CreateTweetDto} from '../dto/create-tweet.dto';
import {Tweet} from '../entities/tweet.entity';
import {FindOneOptions, Repository} from 'typeorm';
import {UpdateTweetDto} from '../dto/update-tweet.dto';
import banWords from '../../assets/ban_words';
import {InjectRepository} from '@nestjs/typeorm';
import {UsersService} from '../../users/users.service';
import { NotificationsService } from '../../notifications/notifications.service';

@Injectable()
export class TweetFilterDecorator extends TweetsService implements OnModuleInit {
    private banWordsSet = new Set<string>();

    constructor(
        @InjectRepository(Tweet)
        protected tweetsRepository: Repository<Tweet>,
        protected usersService: UsersService,
        protected notificationsService: NotificationsService
    ) {
        super(tweetsRepository, usersService, notificationsService);
    }
    

    async onModuleInit() {
        this.loadBanWords();
    }

    private async loadBanWords() {
        
        try {
            banWords.forEach(word => {
                if (word.trim()) this.banWordsSet.add(word.trim());
            });
        } catch (error) {
            console.error('Failed to load ban words', error);
        }
    }

    async create(dto: CreateTweetDto): Promise<Tweet> {
        dto.content = await this.filterContent(dto.content);
        return super.create(dto);
    }

    async update(criteria: FindOneOptions<Tweet>, dto: UpdateTweetDto & { userUuid: string }): Promise<Tweet> {
        // Фильтрация контента перед обновлением
        dto.content = await this.filterContent(dto.content);
        // Вызов оригинального метода с отфильтрованным контентом
        return super.update(criteria, dto);
    }
    

    private async filterContent(text: string): Promise<string> {
        // Разбиваем текст на слова с помощью регулярного выражения
        const words = text.split(/\b/);
    
        // Проходим по всем словам и проверяем, нужно ли их цензурировать
        return words.map(word => {
            // Нормализуем слово для сравнения (например, в нижний регистр)
            const normalizedWord = word.toLowerCase();

            // Проверяем, содержится ли слово в списке запрещённых
            if (banWords.includes(normalizedWord)) {
                if (word.length > 2) {
                    // Заменяем символы на звездочки, оставляем первую и последнюю буквы
                    return word[0] + '*'.repeat(word.length - 2) + word[word.length - 1];
                } else {
                    // Для слов из двух букв заменяем только средний символ
                    return word[0] + '*';
                }
            }
            // Если слово не в списке запрещённых, возвращаем его без изменений
            return word;
        }).join('');
    }
}
