import { observable } from 'mobx';
import { httpService } from '../utils/httpService';
import { PageData, HotelCanStaying } from '../model';

export class HotelService {
    @observable
    pageIndex = 0;

    pageSize = 10;

    totalCount = 0;

    @observable
    list = [];

    async getNextPage() {
        if (this.pageIndex && this.list.length === this.totalCount) return;
        const {
            body: { count, data }
        } = await httpService.get<PageData<HotelCanStaying[]>>(
            '/hotel?' +
                new URLSearchParams({
                    pageIndex: this.pageIndex + 1 + '',
                    pageSize: this.pageSize + ''
                })
        );
        this.pageIndex++, (this.totalCount = count);
        this.list = this.list.concat(data);
        return data;
    }

    update(data: HotelCanStaying, id?: string) {
        return id
            ? httpService.put('/hotel/' + id, data)
            : httpService.post('/hotel', data);
    }

    async delete(id: string) {
        await httpService.delete('/hotel/' + id);
        this.list = this.list.filter(({ objectId }) => objectId !== id);
    }

    async getOne(id: string) {
        const { body } = await httpService.get<HotelCanStaying>('/hotel/' + id);
        return body;
    }
}
