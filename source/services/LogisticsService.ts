import { observable } from 'mobx';
import { LogisticsItem, PageData } from '../model';
import { httpService } from '../utils/httpService';

export class LogisticsService {
    @observable
    pageIndex = 0;
    pageSize = 10;
    totalCount = 0;

    @observable
    list: LogisticsItem[] = [];

    async getNextPage() {
        if (this.pageIndex && this.list.length === this.totalCount) return;
        const {
            body: { count, data }
        } = await httpService.get<PageData<LogisticsItem>>(
            '/logistics?' +
                new URLSearchParams({
                    pageIndex: this.pageIndex + 1 + '',
                    pageSize: this.pageSize + ''
                })
        );
        this.pageIndex++, (this.totalCount = count);
        this.list = this.list.concat(data);
        return data;
    }

    async update(data: LogisticsItem, id?: string) {
        if (!id) {
            const { body } = await httpService.post<LogisticsItem>(
                '/logistics',
                data
            );
            this.list = [body].concat(this.list);
        } else {
            const { body } = await httpService.put<LogisticsItem>(
                '/logistics/' + id,
                data
            );
            const index = this.list.findIndex(
                ({ objectId }) => objectId === id
            );
            this.list[index] = body;
        }
    }

    async getOne(id: string) {
        const { body } = await httpService.get<LogisticsItem>(
            '/logistics/' + id
        );
        return body;
    }

    async delete(id: string) {
        await httpService.delete('/logistics/' + id);
        this.list = this.list.filter(({ objectId }) => objectId !== id);
    }
}
