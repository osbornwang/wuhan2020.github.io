const key = '8325164e247e15eea68b59e89200988b';
interface POI {
    name: string;
    pname: string;
    cityname: string;
    adname: string;
    address: string;
    location: string;
}

interface District {
    adcode: string;
    name: string;
    level: string;
    center: string;
    districts: District[];
}

const requestAMap = async <T = {}>(path: string, data: any): Promise<T> => {
    const response = await fetch(
        `//restapi.amap.com/v3/${path}?${new URLSearchParams({ ...data, key })}`
    );
    const { status, info, ...rest } = await response.json();

    if (status !== '1') throw new URIError(info);

    return rest;
};

export const searchAddress = async (keywords: string) => {
    const { pois } = await requestAMap<{ pois: POI[] }>('place/text', {
        keywords
    });

    return pois.sort(({ name }) => (name === keywords ? -1 : 1));
};

export const getSubDistrict = async (keywords = '中国') => {
    const {
        districts: [{ districts }]
    } = await requestAMap<District>('config/district', { keywords });

    return districts;
};
