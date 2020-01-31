import { observable } from 'mobx';
import { PageData, SuppliesRequirement } from '../model/index';
import { httpService } from '../utils/httpService';

export class HospitalService {
    @observable
    pageIndex = 0;

    pageSize = 10;

    totalCount = 0;

    @observable
    list: SuppliesRequirement[] = [];

    async getNextPage() {
        if (this.pageIndex && this.list.length === this.totalCount) return;

        const {
            body: { count, data }
        } = await httpService.get<PageData<SuppliesRequirement>>(
            '/supplies/requirement?' +
                new URLSearchParams({
                    pageIndex: this.pageIndex + 1 + '',
                    pageSize: this.pageSize + ''
                })
        );
        this.pageIndex++, (this.totalCount = count);

        this.list = this.list.concat(data);

        return data;
    }

    async update(data: SuppliesRequirement, id?: string) {
        if (!id) {
            const { body } = await httpService.post<SuppliesRequirement>(
                '/supplies/requirement',
                data
            );

            this.list = [body].concat(this.list);
        } else {
            const { body } = await httpService.put<SuppliesRequirement>(
                    '/supplies/requirement/' + id,
                    data
                ),
                index = this.list.findIndex(({ objectId }) => objectId === id);

            this.list[index] = body;
        }
    }

    async getOne(id: string) {
        const { body } = await httpService.get<SuppliesRequirement>(
            '/supplies/requirement/' + id
        );
        return body;
    }

    async delete(id: string) {
        await httpService.delete('/supplies/requirement/' + id);

        this.list = this.list.filter(({ objectId }) => objectId !== id);
    }
}
