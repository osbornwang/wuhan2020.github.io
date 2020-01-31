import { component, createCell, Fragment } from 'web-cell';
import { observer } from 'mobx-web-cell';
import { HTMLRouter } from 'cell-router/source';
import { NavBar } from 'boot-cell/source/Navigator/NavBar';
import { DropMenu } from 'boot-cell/source/Navigator/DropMenu';
import { history } from '../utils/History';
import { HomePage } from './Home';
import { HospitalPage } from './Hospital';
import { HospitalEdit } from './Hospital/Edit';
import { LogisticsPage } from './Logistics';
import { LogisticsEdit } from './Logistics/Edit';
import { HotelPage } from './Hotel';
import { HotelEdit } from './Hotel/Edit';
import { FactoryPage } from './Factory';
import { FactoryEdit } from './Factory/edit';
import { DonationPage } from './Donation';
import { ClinicPage } from './Clinic';
import { sessionService } from '../services';
import { Menu } from '../model';

@observer
@component({
    tagName: 'page-router',
    renderTarget: 'children'
})
export class PageRouter extends HTMLRouter {
    protected history = history;
    protected routes = [
        { paths: [''], component: HomePage },
        { paths: ['hospital'], component: HospitalPage },
        { paths: ['hospital/edit'], component: HospitalEdit },
        { paths: ['logistics'], component: LogisticsPage },
        { paths: ['logistics/edit'], component: LogisticsEdit },
        { paths: ['hotel'], component: HotelPage },
        { paths: ['hotel/edit'], component: HotelEdit },
        { paths: ['factory'], component: FactoryPage },
        { paths: ['factory/edit'], component: FactoryEdit },
        { paths: ['donation'], component: DonationPage },
        { paths: ['clinic'], component: ClinicPage }
    ];

    connectedCallback() {
        this.classList.add('d-flex', 'flex-column', 'vh-100');

        super.connectedCallback();
    }

    async signOut() {
        await sessionService.signOut();

        location.href = '.';
    }

    render() {
        return (
            <Fragment>
                <NavBar
                    title="2020 援助武汉"
                    menu={Menu.map(({ title, href }) => ({
                        title,
                        href,
                        active:
                            history.path === href ||
                            (!!href && history.path.startsWith(href))
                    }))}
                    narrow
                >
                    {sessionService.user && (
                        <DropMenu
                            title={sessionService.user.username}
                            alignType="right"
                            alignSize="md"
                            list={[
                                {
                                    title: '登出',
                                    href: '#',
                                    onClick: this.signOut
                                }
                            ]}
                        />
                    )}
                </NavBar>

                <main className="flex-grow-1 container my-5 pt-3">
                    {super.render()}
                </main>

                <footer className="text-center bg-light py-5">
                    Proudly developed with
                    <a
                        className="mx-1"
                        target="_blank"
                        href="https://web-cell.dev/"
                    >
                        WebCell v2
                    </a>
                    &amp;
                    <a
                        className="mx-1"
                        target="_blank"
                        href="https://web-cell.dev/BootCell/"
                    >
                        BootCell v1
                    </a>
                </footer>
            </Fragment>
        );
    }
}
