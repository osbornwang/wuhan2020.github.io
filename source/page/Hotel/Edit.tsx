import { component, mixin, watch, createCell } from 'web-cell';
import { FormField } from 'boot-cell/source/Form/FormField';
import { Button } from 'boot-cell/source/Form/Button';
import { SessionBox, AddressField, ContactField } from '../../component';
import { HotelCanStaying, GeoCoord, Contact, RouteRoot } from '../../model';
import { hotelService } from '../../services';
import { history } from '../../utils/History';

type HotelCanStayingEditState = HotelCanStaying & { loading?: boolean };

@component({
    tagName: 'hotel-edit',
    renderTarget: 'children'
})
export class HotelEdit extends mixin<
    { srid: string },
    HotelCanStayingEditState
>() {
    @watch
    srid = '';

    state = {
        name: '',
        address: '',
        capacity: 0,
        loading: false,
        province: '',
        city: '',
        district: '',
        coords: {} as GeoCoord,
        url: '',
        contacts: [{} as Contact],
        remark: ''
    };

    async connectedCallback() {
        super.connectedCallback();

        if (!this.srid) return;

        const {
            name,
            address,
            province,
            city,
            district,
            contacts,
            capacity,
            coords,
            url
        } = await hotelService.getOne(this.srid);

        this.setState({
            name,
            address,
            province,
            city,
            district,
            contacts,
            capacity,
            coords,
            url
        });
    }

    changeText = ({ target }: Event) => {
        const { name, value } = target as HTMLInputElement;

        this.state[name] = value;
    };

    updateText = (event: Event) => {
        event.stopPropagation();

        this.setState({
            name: (event.target as HTMLInputElement).value
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

        const params = { ...this.state };

        try {
            await hotelService.update(params, this.srid);

            self.alert('发布成功！');

            history.push(RouteRoot.Hotel);
        } finally {
            await this.setState({ loading: false });
        }
    };

    render(
        _,
        {
            name,
            address,
            capacity,
            contacts,
            url,
            province,
            city,
            district,
            loading
        }: HotelCanStayingEditState
    ) {
        return (
            <SessionBox>
                <h2>发布住宿信息</h2>
                <form onChange={this.changeText} onSubmit={this.handleSubmit}>
                    <FormField
                        name="name"
                        required
                        defaultValue={name}
                        label="酒店"
                        placeholder="酒店名称"
                        onChange={this.updateText}
                    />
                    <FormField label="酒店地址">
                        <AddressField
                            place={name}
                            {...{ province, city, district, address }}
                            onChange={this.changeAddress}
                        />
                    </FormField>

                    <FormField
                        type="number"
                        name="capacity"
                        required
                        defaultValue={capacity + ''}
                        label="可接待人数"
                    />
                    <FormField
                        type="url"
                        name="url"
                        required
                        defaultValue={url}
                        label="信息来源网址"
                    />
                    <ContactField
                        list={contacts}
                        onChange={(event: CustomEvent) =>
                            (this.state.contacts = event.detail)
                        }
                    />
                    <div className="form-group mt-3">
                        <Button type="submit" block disabled={loading}>
                            提交
                        </Button>
                        <Button
                            type="reset"
                            kind="danger"
                            block
                            onClick={() => history.push(RouteRoot.Hotel)}
                        >
                            取消
                        </Button>
                    </div>
                </form>
            </SessionBox>
        );
    }
}
