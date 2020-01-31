import { observable } from 'mobx';
import { Clinic, PageData } from '../model';
import { httpService } from '../utils/httpService';

export class ClinicService {
    @observable
    pageIndex = 0;

    pageSize = 10;

    totalCount = 0;

    @observable
    list: Clinic[] = [];

    async getNextPage() {
        if (this.pageIndex && this.list.length === this.totalCount) return;

        const {
            body: { count, data }
        } = await httpService.get<PageData<Clinic>>(
            '/clinic?' +
                new URLSearchParams({
                    pageIndex: this.pageIndex + 1 + '',
                    pageSize: this.pageSize + ''
                })
        );
        this.pageIndex++, (this.totalCount = count);

        this.list = this.list.concat(data);

        return data;
    }

    async update(data: Clinic, id?: string) {
        if (!id) {
            const { body } = await httpService.post<Clinic>('/clinic', data);

            this.list = [body].concat(this.list);
        } else {
            const { body } = await httpService.put<Clinic>(
                    '/clinic/' + id,
                    data
                ),
                index = this.list.findIndex(({ objectId }) => objectId === id);

            this.list[index] = body;
        }
    }

    async getOne(id: string) {
        const { body } = await httpService.get<Clinic>('/clinic/' + id);

        return body;
    }

    async delete(id: string) {
        await httpService.delete('/clinic/' + id);

        this.list = this.list.filter(({ objectId }) => objectId !== id);
    }
}
