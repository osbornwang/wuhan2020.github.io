import { component, mixin, watch, createCell } from 'web-cell';
import { FormField } from 'boot-cell/source/Form/FormField';
import { Button } from 'boot-cell/source/Form/Button';
import { mergeList } from '../../utils/utility';
import CommonSupplies from './Supplies';
import { history } from '../../utils/History';

import {
    SessionBox,
    ContactField,
    AddressField,
    SuppliesField
} from '../../component';
import {
    SuppliesRequirement,
    GeoCoord,
    Supplies,
    Contact,
    RouteRoot
} from '../../model';
import { hospitalService } from '../../services';

type HospitalEditProps = SuppliesRequirement & { loading?: boolean };

@component({
    tagName: 'hospital-edit',
    renderTarget: 'children'
})
export class HospitalEdit extends mixin<{ srid: string }, HospitalEditProps>() {
    @watch
    srid = '';

    state = {
        loading: false,
        hospital: '',
        province: '',
        city: '',
        district: '',
        address: '',
        coords: {} as GeoCoord,
        url: '',
        supplies: CommonSupplies as Supplies[],
        contacts: [{} as Contact],
        remark: ''
    };

    async connectedCallback() {
        super.connectedCallback();

        if (!this.srid) return;

        await this.setState({ loading: true });

        const {
            hospital,
            province,
            city,
            district,
            address,
            coords,
            url,
            supplies,
            contacts,
            remark
        } = await hospitalService.getOne(this.srid);

        this.setState({
            loading: false,
            hospital,
            province,
            city,
            district,
            address,
            coords,
            url,
            supplies: mergeList<Supplies>(
                'name',
                this.state.supplies,
                supplies
            ),
            contacts,
            remark
        });
    }

    changeText = ({ target }: Event) => {
        const { name, value } = target as HTMLInputElement;

        this.state[name] = value;
    };

    updateText = (event: Event) => {
        event.stopPropagation();

        this.setState({
            hospital: (event.target as HTMLInputElement).value
        });
    };

    changeAddress = (event: CustomEvent) => {
        const { latitude, longitude, ...rest } = event.detail;

        Object.assign(this.state, {
            ...rest,
            coords: { latitude, longitude }
        });
    };

    handleSubmit = async (event: Event) => {
        event.preventDefault();

        await this.setState({ loading: true });

        const { loading, supplies, ...data } = { ...this.state };

        try {
            await hospitalService.update(
                { ...data, supplies: supplies.filter(({ count }) => count) },
                this.srid
            );
            self.alert('发布成功！');

            history.push(RouteRoot.Hospital);
        } finally {
            await this.setState({ loading: false });
        }
    };

    render(
        _,
        {
            hospital,
            province,
            city,
            district,
            address,
            url,
            supplies,
            contacts,
            remark,
            loading
        }: HospitalEditProps
    ) {
        return (
            <SessionBox>
                <h2>医用物资需求发布</h2>

                <form onChange={this.changeText} onSubmit={this.handleSubmit}>
                    <FormField
                        name="hospital"
                        required
                        defaultValue={hospital}
                        label="医疗机构"
                        placeholder="可详细至分院、院区、科室"
                        onChange={this.updateText}
                    />
                    <FormField label="机构地址">
                        <AddressField
                            place={hospital}
                            {...{ province, city, district, address }}
                            onChange={this.changeAddress}
                        />
                    </FormField>

                    <FormField
                        type="url"
                        name="url"
                        required
                        defaultValue={url}
                        label="官方网址"
                    />
                    <SuppliesField
                        list={supplies}
                        onChange={(event: CustomEvent) =>
                            (this.state.supplies = event.detail)
                        }
                    />
                    <ContactField
                        list={contacts}
                        onChange={(event: CustomEvent) =>
                            (this.state.contacts = event.detail)
                        }
                    />
                    <FormField
                        is="textarea"
                        name="remark"
                        label="备注"
                        defaultValue={remark}
                    />
                    <div className="form-group mt-3">
                        <Button type="submit" block disabled={loading}>
                            提交
                        </Button>
                        <Button
                            type="reset"
                            kind="danger"
                            block
                            onClick={() => history.push(RouteRoot.Hospital)}
                        >
                            取消
                        </Button>
                    </div>
                </form>
            </SessionBox>
        );
    }
}
