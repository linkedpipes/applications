// @flow
import React, { PureComponent } from 'react';
import {
  withScriptjs,
  withGoogleMap,
  GoogleMap,
  Marker
} from 'react-google-maps';
import MarkerClusterer from 'react-google-maps/lib/components/addons/MarkerClusterer';
import { compose, withProps, type HOC } from 'recompose';
import uuid from 'uuid';
import { Log, VisualizersService } from '@utils';

type Props = {
  classes: {
    progress: number
  },
  selectedResultGraphIri: string,
  handleSetCurrentApplicationData: Function
};

type State = {
  markers: Array<{ coordinates: { lat: number, lon: number } }>,
  zoomToMarkers: any
};

const markersDummy = [
  {
    uri: 'http://www.wikidata.org/entity/Q18812901',
    coordinates: { lat: 51.48686, lng: 3.51008 },
    label: 'in het bosgebied Klein-Valkenisse te Klein-Valkenisse',
    description: 'rijksmonument (nummer 529370)'
  },
  {
    uri: 'http://www.wikidata.org/entity/Q26960632',
    coordinates: { lat: 52.920911111, lng: 6.569655555 },
    label: 'Barak 56',
    description: 'gebouw in Kamp Westerbork, Nederland'
  },
  {
    uri: 'http://www.wikidata.org/entity/Q10083',
    coordinates: { lat: 51.5469, lng: 3.5403 },
    label: 'Feare (gemeente)',
    description: null
  },
  {
    uri: 'http://www.wikidata.org/entity/Q10083',
    coordinates: { lat: 51.5469, lng: 3.5403 },
    label: 'Gemeente Veere',
    description: null
  },
  {
    uri: 'http://www.wikidata.org/entity/Q10083',
    coordinates: { lat: 51.5469, lng: 3.5403 },
    label: 'Ter Veere',
    description: null
  },
  {
    uri: 'http://www.wikidata.org/entity/Q10083',
    coordinates: { lat: 51.5469, lng: 3.5403 },
    label: 'Veere',
    description: null
  },
  {
    uri: 'http://www.wikidata.org/entity/Q10083',
    coordinates: { lat: 51.5469, lng: 3.5403 },
    label: 'Veere',
    description: null
  },
  {
    uri: 'http://www.wikidata.org/entity/Q10083',
    coordinates: { lat: 51.5469, lng: 3.5403 },
    label: 'Veere',
    description: null
  },
  {
    uri: 'http://www.wikidata.org/entity/Q10083',
    coordinates: { lat: 51.5469, lng: 3.5403 },
    label: 'Veere',
    description: null
  },
  {
    uri: 'http://www.wikidata.org/entity/Q10083',
    coordinates: { lat: 51.5469, lng: 3.5403 },
    label: 'Veere',
    description: null
  },
  {
    uri: 'http://www.wikidata.org/entity/Q10083',
    coordinates: { lat: 51.5469, lng: 3.5403 },
    label: 'Veere',
    description: null
  },
  {
    uri: 'http://www.wikidata.org/entity/Q10083',
    coordinates: { lat: 51.5469, lng: 3.5403 },
    label: 'Veere',
    description: null
  },
  {
    uri: 'http://www.wikidata.org/entity/Q10083',
    coordinates: { lat: 51.5469, lng: 3.5403 },
    label: 'Veere',
    description: null
  },
  {
    uri: 'http://www.wikidata.org/entity/Q10083',
    coordinates: { lat: 51.5469, lng: 3.5403 },
    label: 'Veere',
    description: null
  },
  {
    uri: 'http://www.wikidata.org/entity/Q10083',
    coordinates: { lat: 51.5469, lng: 3.5403 },
    label: 'Veere',
    description: null
  },
  {
    uri: 'http://www.wikidata.org/entity/Q10083',
    coordinates: { lat: 51.5469, lng: 3.5403 },
    label: 'Veere',
    description: null
  },
  {
    uri: 'http://www.wikidata.org/entity/Q10083',
    coordinates: { lat: 51.5469, lng: 3.5403 },
    label: 'Veere',
    description: null
  },
  {
    uri: 'http://www.wikidata.org/entity/Q10083',
    coordinates: { lat: 51.5469, lng: 3.5403 },
    label: 'Veere',
    description: null
  },
  {
    uri: 'http://www.wikidata.org/entity/Q10083',
    coordinates: { lat: 51.5469, lng: 3.5403 },
    label: 'Veere',
    description: null
  },
  {
    uri: 'http://www.wikidata.org/entity/Q10083',
    coordinates: { lat: 51.5469, lng: 3.5403 },
    label: 'Veere',
    description: null
  },
  {
    uri: 'http://www.wikidata.org/entity/Q10083',
    coordinates: { lat: 51.5469, lng: 3.5403 },
    label: 'Veere',
    description: null
  },
  {
    uri: 'http://www.wikidata.org/entity/Q10083',
    coordinates: { lat: 51.5469, lng: 3.5403 },
    label: 'Veere',
    description: null
  },
  {
    uri: 'http://www.wikidata.org/entity/Q10083',
    coordinates: { lat: 51.5469, lng: 3.5403 },
    label: 'Veere',
    description: null
  },
  {
    uri: 'http://www.wikidata.org/entity/Q10083',
    coordinates: { lat: 51.5469, lng: 3.5403 },
    label: 'Veere',
    description: null
  },
  {
    uri: 'http://www.wikidata.org/entity/Q10083',
    coordinates: { lat: 51.5469, lng: 3.5403 },
    label: 'Veere',
    description: null
  },
  {
    uri: 'http://www.wikidata.org/entity/Q10083',
    coordinates: { lat: 51.5469, lng: 3.5403 },
    label: 'Veere',
    description: null
  },
  {
    uri: 'http://www.wikidata.org/entity/Q10083',
    coordinates: { lat: 51.5469, lng: 3.5403 },
    label: 'Veere',
    description: null
  },
  {
    uri: 'http://www.wikidata.org/entity/Q10083',
    coordinates: { lat: 51.5469, lng: 3.5403 },
    label: 'Veere',
    description: null
  },
  {
    uri: 'http://www.wikidata.org/entity/Q10083',
    coordinates: { lat: 51.5469, lng: 3.5403 },
    label: 'Veere',
    description: null
  },
  {
    uri: 'http://www.wikidata.org/entity/Q10083',
    coordinates: { lat: 51.5469, lng: 3.5403 },
    label: 'Veere',
    description: null
  },
  {
    uri: 'http://www.wikidata.org/entity/Q10083',
    coordinates: { lat: 51.5469, lng: 3.5403 },
    label: 'Veere',
    description: null
  },
  {
    uri: 'http://www.wikidata.org/entity/Q10083',
    coordinates: { lat: 51.5469, lng: 3.5403 },
    label: 'Veere',
    description: null
  },
  {
    uri: 'http://www.wikidata.org/entity/Q10083',
    coordinates: { lat: 51.5469, lng: 3.5403 },
    label: 'Veere',
    description: null
  },
  {
    uri: 'http://www.wikidata.org/entity/Q10083',
    coordinates: { lat: 51.5469, lng: 3.5403 },
    label: 'Veere',
    description: null
  },
  {
    uri: 'http://www.wikidata.org/entity/Q10083',
    coordinates: { lat: 51.5469, lng: 3.5403 },
    label: 'Veere',
    description: null
  },
  {
    uri: 'http://www.wikidata.org/entity/Q10083',
    coordinates: { lat: 51.5469, lng: 3.5403 },
    label: 'Veere',
    description: null
  },
  {
    uri: 'http://www.wikidata.org/entity/Q10083',
    coordinates: { lat: 51.5469, lng: 3.5403 },
    label: 'Veere',
    description: null
  },
  {
    uri: 'http://www.wikidata.org/entity/Q10083',
    coordinates: { lat: 51.5469, lng: 3.5403 },
    label: 'Veere',
    description: null
  },
  {
    uri: 'http://www.wikidata.org/entity/Q10083',
    coordinates: { lat: 51.5469, lng: 3.5403 },
    label: 'Вере',
    description: null
  },
  {
    uri: 'http://www.wikidata.org/entity/Q10083',
    coordinates: { lat: 51.5469, lng: 3.5403 },
    label: 'Вере',
    description: null
  },
  {
    uri: 'http://www.wikidata.org/entity/Q10083',
    coordinates: { lat: 51.5469, lng: 3.5403 },
    label: 'Վեյրե',
    description: null
  },
  {
    uri: 'http://www.wikidata.org/entity/Q10083',
    coordinates: { lat: 51.5469, lng: 3.5403 },
    label: 'فيراه',
    description: null
  },
  {
    uri: 'http://www.wikidata.org/entity/Q10083',
    coordinates: { lat: 51.5469, lng: 3.5403 },
    label: 'فیره',
    description: null
  },
  {
    uri: 'http://www.wikidata.org/entity/Q10083',
    coordinates: { lat: 51.5469, lng: 3.5403 },
    label: '費勒',
    description: null
  },
  {
    uri: 'http://www.wikidata.org/entity/Q10083',
    coordinates: { lat: 51.5469, lng: 3.5403 },
    label: '費勒',
    description: null
  },
  {
    uri: 'http://www.wikidata.org/entity/Q10083',
    coordinates: { lat: 51.5469, lng: 3.5403 },
    label: '費勒',
    description: null
  },
  {
    uri: 'http://www.wikidata.org/entity/Q10083',
    coordinates: { lat: 51.5469, lng: 3.5403 },
    label: '費勒',
    description: null
  },
  {
    uri: 'http://www.wikidata.org/entity/Q10083',
    coordinates: { lat: 51.5469, lng: 3.5403 },
    label: '費勒',
    description: null
  },
  {
    uri: 'http://www.wikidata.org/entity/Q10083',
    coordinates: { lat: 51.5469, lng: 3.5403 },
    label: '费勒',
    description: null
  },
  {
    uri: 'http://www.wikidata.org/entity/Q10083',
    coordinates: { lat: 51.5469, lng: 3.5403 },
    label: '费勒',
    description: null
  },
  {
    uri: 'http://www.wikidata.org/entity/Q10083',
    coordinates: { lat: 51.5469, lng: 3.5403 },
    label: '费勒',
    description: null
  },
  {
    uri: 'http://www.wikidata.org/entity/Q10083',
    coordinates: { lat: 51.5469, lng: 3.5403 },
    label: '费勒',
    description: null
  },
  {
    uri: 'http://www.wikidata.org/entity/Q3028083',
    coordinates: { lat: 52.9211, lng: 6.5367 },
    label: 'Hoghalenas',
    description: null
  },
  {
    uri: 'http://www.wikidata.org/entity/Q3028083',
    coordinates: { lat: 52.9211, lng: 6.5367 },
    label: 'Hooghalen',
    description: null
  },
  {
    uri: 'http://www.wikidata.org/entity/Q3028083',
    coordinates: { lat: 52.9211, lng: 6.5367 },
    label: 'Hooghalen',
    description: null
  },
  {
    uri: 'http://www.wikidata.org/entity/Q3028083',
    coordinates: { lat: 52.9211, lng: 6.5367 },
    label: 'Hooghalen',
    description: null
  },
  {
    uri: 'http://www.wikidata.org/entity/Q3028083',
    coordinates: { lat: 52.9211, lng: 6.5367 },
    label: 'Hooghalen',
    description: null
  },
  {
    uri: 'http://www.wikidata.org/entity/Q3028083',
    coordinates: { lat: 52.9211, lng: 6.5367 },
    label: 'Hooghalen',
    description: null
  },
  {
    uri: 'http://www.wikidata.org/entity/Q3028083',
    coordinates: { lat: 52.9211, lng: 6.5367 },
    label: 'Hooghalen',
    description: null
  },
  {
    uri: 'http://www.wikidata.org/entity/Q3028083',
    coordinates: { lat: 52.9211, lng: 6.5367 },
    label: 'Hooghalen',
    description: null
  },
  {
    uri: 'http://www.wikidata.org/entity/Q3028083',
    coordinates: { lat: 52.9211, lng: 6.5367 },
    label: 'Hooghalen',
    description: null
  },
  {
    uri: 'http://www.wikidata.org/entity/Q3028083',
    coordinates: { lat: 52.9211, lng: 6.5367 },
    label: 'Hooghalen',
    description: null
  },
  {
    uri: 'http://www.wikidata.org/entity/Q3028083',
    coordinates: { lat: 52.9211, lng: 6.5367 },
    label: 'Хогхален',
    description: null
  },
  {
    uri: 'http://www.wikidata.org/entity/Q3028083',
    coordinates: { lat: 52.9211, lng: 6.5367 },
    label: 'هوخ‌هالن',
    description: null
  },
  {
    uri: 'http://www.wikidata.org/entity/Q323420',
    coordinates: { lat: 52.916666666, lng: 6.606944444 },
    label: 'Campo de concentração de Westerbork',
    description: null
  },
  {
    uri: 'http://www.wikidata.org/entity/Q323420',
    coordinates: { lat: 52.916666666, lng: 6.606944444 },
    label: 'Durchgangslager Westerbork',
    description: null
  },
  {
    uri: 'http://www.wikidata.org/entity/Q323420',
    coordinates: { lat: 52.916666666, lng: 6.606944444 },
    label: 'Durchgangslager Westerbork',
    description: null
  },
  {
    uri: 'http://www.wikidata.org/entity/Q323420',
    coordinates: { lat: 52.916666666, lng: 6.606944444 },
    label: 'Internační tábor Westerbork',
    description: null
  },
  {
    uri: 'http://www.wikidata.org/entity/Q323420',
    coordinates: { lat: 52.916666666, lng: 6.606944444 },
    label: 'Kamp Westerbork',
    description: null
  },
  {
    uri: 'http://www.wikidata.org/entity/Q323420',
    coordinates: { lat: 52.916666666, lng: 6.606944444 },
    label: 'Kamp Westerbork',
    description: null
  },
  {
    uri: 'http://www.wikidata.org/entity/Q323420',
    coordinates: { lat: 52.916666666, lng: 6.606944444 },
    label: 'Kamp transit Westerbork',
    description: null
  },
  {
    uri: 'http://www.wikidata.org/entity/Q323420',
    coordinates: { lat: 52.916666666, lng: 6.606944444 },
    label: 'Lagărul de tranzit Westerbork',
    description: null
  },
  {
    uri: 'http://www.wikidata.org/entity/Q323420',
    coordinates: { lat: 52.916666666, lng: 6.606944444 },
    label: 'Westerbork',
    description: null
  },
  {
    uri: 'http://www.wikidata.org/entity/Q323420',
    coordinates: { lat: 52.916666666, lng: 6.606944444 },
    label: 'Westerbork',
    description: null
  },
  {
    uri: 'http://www.wikidata.org/entity/Q323420',
    coordinates: { lat: 52.916666666, lng: 6.606944444 },
    label: 'Westerbork',
    description: null
  },
  {
    uri: 'http://www.wikidata.org/entity/Q323420',
    coordinates: { lat: 52.916666666, lng: 6.606944444 },
    label: 'Westerbork',
    description: null
  },
  {
    uri: 'http://www.wikidata.org/entity/Q323420',
    coordinates: { lat: 52.916666666, lng: 6.606944444 },
    label: 'Westerbork',
    description: null
  },
  {
    uri: 'http://www.wikidata.org/entity/Q323420',
    coordinates: { lat: 52.916666666, lng: 6.606944444 },
    label: 'Westerbork',
    description: null
  },
  {
    uri: 'http://www.wikidata.org/entity/Q323420',
    coordinates: { lat: 52.916666666, lng: 6.606944444 },
    label: 'Westerbork concentration camp',
    description: null
  },
  {
    uri: 'http://www.wikidata.org/entity/Q323420',
    coordinates: { lat: 52.916666666, lng: 6.606944444 },
    label: 'camp de concentració de Westerbork',
    description: null
  },
  {
    uri: 'http://www.wikidata.org/entity/Q323420',
    coordinates: { lat: 52.916666666, lng: 6.606944444 },
    label: 'campo di concentramento di Westerbork',
    description: null
  },
  {
    uri: 'http://www.wikidata.org/entity/Q323420',
    coordinates: { lat: 52.916666666, lng: 6.606944444 },
    label: 'Вестерборк',
    description: null
  },
  {
    uri: 'http://www.wikidata.org/entity/Q323420',
    coordinates: { lat: 52.916666666, lng: 6.606944444 },
    label: 'Вестерборк',
    description: null
  },
  {
    uri: 'http://www.wikidata.org/entity/Q323420',
    coordinates: { lat: 52.916666666, lng: 6.606944444 },
    label: 'Вестерборк',
    description: null
  },
  {
    uri: 'http://www.wikidata.org/entity/Q323420',
    coordinates: { lat: 52.916666666, lng: 6.606944444 },
    label: 'וסטרבורק',
    description: null
  },
  {
    uri: 'http://www.wikidata.org/entity/Q323420',
    coordinates: { lat: 52.916666666, lng: 6.606944444 },
    label: 'ヴェステルボルク通過収容所',
    description: null
  },
  {
    uri: 'http://www.wikidata.org/entity/Q323420',
    coordinates: { lat: 52.916666666, lng: 6.606944444 },
    label: '韋斯特博克營',
    description: null
  },
  {
    uri: 'http://www.wikidata.org/entity/Q323420',
    coordinates: { lat: 52.916666666, lng: 6.606944444 },
    label: '韋斯特博克集中營',
    description: null
  },
  {
    uri: 'http://www.wikidata.org/entity/Q323420',
    coordinates: { lat: 52.916666666, lng: 6.606944444 },
    label: '韦斯特博克营',
    description: null
  },
  {
    uri: 'http://www.wikidata.org/entity/Q323420',
    coordinates: { lat: 52.916666666, lng: 6.606944444 },
    label: '韦斯特博克营',
    description: null
  },
  {
    uri: 'http://www.wikidata.org/entity/Q55',
    coordinates: { lat: 52.316666666, lng: 5.55 },
    label: 'Alamad',
    description: null
  },
  {
    uri: 'http://www.wikidata.org/entity/Q55',
    coordinates: { lat: 52.316666666, lng: 5.55 },
    label: 'Alankomaat',
    description: null
  },
  {
    uri: 'http://www.wikidata.org/entity/Q55',
    coordinates: { lat: 52.316666666, lng: 5.55 },
    label: 'An Ísiltír',
    description: null
  },
  {
    uri: 'http://www.wikidata.org/entity/Q55',
    coordinates: { lat: 52.316666666, lng: 5.55 },
    label: "Aynacha Jach'a Markanaka",
    description: null
  },
  {
    uri: 'http://www.wikidata.org/entity/Q55',
    coordinates: { lat: 52.316666666, lng: 5.55 },
    label: 'Bakrakondre',
    description: null
  },
  {
    uri: 'http://www.wikidata.org/entity/Q55',
    coordinates: { lat: 52.316666666, lng: 5.55 },
    label: 'Balando',
    description: null
  },
  {
    uri: 'http://www.wikidata.org/entity/Q55',
    coordinates: { lat: 52.316666666, lng: 5.55 },
    label: 'Bas Payis',
    description: null
  },
  {
    uri: 'http://www.wikidata.org/entity/Q55',
    coordinates: { lat: 52.316666666, lng: 5.55 },
    label: 'Bas-Païs',
    description: null
  },
  {
    uri: 'http://www.wikidata.org/entity/Q55',
    coordinates: { lat: 52.316666666, lng: 5.55 },
    label: 'Belanda',
    description: null
  },
  {
    uri: 'http://www.wikidata.org/entity/Q55',
    coordinates: { lat: 52.316666666, lng: 5.55 },
    label: 'Belanda',
    description: null
  },
  {
    uri: 'http://www.wikidata.org/entity/Q55',
    coordinates: { lat: 52.316666666, lng: 5.55 },
    label: 'Belanda',
    description: null
  },
  {
    uri: 'http://www.wikidata.org/entity/Q55',
    coordinates: { lat: 52.316666666, lng: 5.55 },
    label: 'Beulanda',
    description: null
  },
  {
    uri: 'http://www.wikidata.org/entity/Q55',
    coordinates: { lat: 52.316666666, lng: 5.55 },
    label: 'Dem Nethiland',
    description: null
  },
  {
    uri: 'http://www.wikidata.org/entity/Q55',
    coordinates: { lat: 52.316666666, lng: 5.55 },
    label: 'ENetherlands',
    description: null
  },
  {
    uri: 'http://www.wikidata.org/entity/Q55',
    coordinates: { lat: 52.316666666, lng: 5.55 },
    label: 'Eben Eyong',
    description: null
  },
  {
    uri: 'http://www.wikidata.org/entity/Q55',
    coordinates: { lat: 52.316666666, lng: 5.55 },
    label: 'Felemenk',
    description: null
  },
  {
    uri: 'http://www.wikidata.org/entity/Q55',
    coordinates: { lat: 52.316666666, lng: 5.55 },
    label: 'Felemenk',
    description: null
  },
  {
    uri: 'http://www.wikidata.org/entity/Q55',
    coordinates: { lat: 52.316666666, lng: 5.55 },
    label: 'Herbehereak',
    description: null
  },
  {
    uri: 'http://www.wikidata.org/entity/Q55',
    coordinates: { lat: 52.316666666, lng: 5.55 },
    label: 'Holand',
    description: null
  },
  {
    uri: 'http://www.wikidata.org/entity/Q55',
    coordinates: { lat: 52.316666666, lng: 5.55 },
    label: 'Holand',
    description: null
  },
  {
    uri: 'http://www.wikidata.org/entity/Q55',
    coordinates: { lat: 52.316666666, lng: 5.55 },
    label: 'Holanda',
    description: null
  },
  {
    uri: 'http://www.wikidata.org/entity/Q55',
    coordinates: { lat: 52.316666666, lng: 5.55 },
    label: 'Holanda',
    description: null
  },
  {
    uri: 'http://www.wikidata.org/entity/Q55',
    coordinates: { lat: 52.316666666, lng: 5.55 },
    label: 'Holanda',
    description: null
  },
  {
    uri: 'http://www.wikidata.org/entity/Q55',
    coordinates: { lat: 52.316666666, lng: 5.55 },
    label: 'Holanda',
    description: null
  },
  {
    uri: 'http://www.wikidata.org/entity/Q55',
    coordinates: { lat: 52.316666666, lng: 5.55 },
    label: 'Holandia',
    description: null
  },
  {
    uri: 'http://www.wikidata.org/entity/Q55',
    coordinates: { lat: 52.316666666, lng: 5.55 },
    label: 'Holandija',
    description: null
  },
  {
    uri: 'http://www.wikidata.org/entity/Q55',
    coordinates: { lat: 52.316666666, lng: 5.55 },
    label: 'Holandija',
    description: null
  },
  {
    uri: 'http://www.wikidata.org/entity/Q55',
    coordinates: { lat: 52.316666666, lng: 5.55 },
    label: 'Holandija',
    description: null
  },
  {
    uri: 'http://www.wikidata.org/entity/Q55',
    coordinates: { lat: 52.316666666, lng: 5.55 },
    label: 'Holandsko',
    description: null
  },
  {
    uri: 'http://www.wikidata.org/entity/Q55',
    coordinates: { lat: 52.316666666, lng: 5.55 },
    label: 'Holani',
    description: null
  },
  {
    uri: 'http://www.wikidata.org/entity/Q55',
    coordinates: { lat: 52.316666666, lng: 5.55 },
    label: 'Holannda',
    description: null
  },
  {
    uri: 'http://www.wikidata.org/entity/Q55',
    coordinates: { lat: 52.316666666, lng: 5.55 },
    label: 'Holland',
    description: null
  },
  {
    uri: 'http://www.wikidata.org/entity/Q55',
    coordinates: { lat: 52.316666666, lng: 5.55 },
    label: 'Holland',
    description: null
  },
  {
    uri: 'http://www.wikidata.org/entity/Q55',
    coordinates: { lat: 52.316666666, lng: 5.55 },
    label: 'Holland',
    description: null
  },
  {
    uri: 'http://www.wikidata.org/entity/Q55',
    coordinates: { lat: 52.316666666, lng: 5.55 },
    label: 'Holland',
    description: null
  },
  {
    uri: 'http://www.wikidata.org/entity/Q55',
    coordinates: { lat: 52.316666666, lng: 5.55 },
    label: 'Holland',
    description: null
  },
  {
    uri: 'http://www.wikidata.org/entity/Q55',
    coordinates: { lat: 52.316666666, lng: 5.55 },
    label: 'Holland',
    description: null
  },
  {
    uri: 'http://www.wikidata.org/entity/Q55',
    coordinates: { lat: 52.316666666, lng: 5.55 },
    label: 'Holland',
    description: null
  },
  {
    uri: 'http://www.wikidata.org/entity/Q55',
    coordinates: { lat: 52.316666666, lng: 5.55 },
    label: 'Holland',
    description: null
  },
  {
    uri: 'http://www.wikidata.org/entity/Q55',
    coordinates: { lat: 52.316666666, lng: 5.55 },
    label: 'Holland',
    description: null
  },
  {
    uri: 'http://www.wikidata.org/entity/Q55',
    coordinates: { lat: 52.316666666, lng: 5.55 },
    label: 'Holland',
    description: null
  },
  {
    uri: 'http://www.wikidata.org/entity/Q55',
    coordinates: { lat: 52.316666666, lng: 5.55 },
    label: 'Hollanda',
    description: null
  },
  {
    uri: 'http://www.wikidata.org/entity/Q55',
    coordinates: { lat: 52.316666666, lng: 5.55 },
    label: 'Hollanda',
    description: null
  },
  {
    uri: 'http://www.wikidata.org/entity/Q55',
    coordinates: { lat: 52.316666666, lng: 5.55 },
    label: 'Hollandi',
    description: null
  },
  {
    uri: 'http://www.wikidata.org/entity/Q55',
    coordinates: { lat: 52.316666666, lng: 5.55 },
    label: 'Hollandia',
    description: null
  },
  {
    uri: 'http://www.wikidata.org/entity/Q55',
    coordinates: { lat: 52.316666666, lng: 5.55 },
    label: 'Hollandii',
    description: null
  },
  {
    uri: 'http://www.wikidata.org/entity/Q55',
    coordinates: { lat: 52.316666666, lng: 5.55 },
    label: 'Hulanda',
    description: null
  },
  {
    uri: 'http://www.wikidata.org/entity/Q55',
    coordinates: { lat: 52.316666666, lng: 5.55 },
    label: 'Hwzlanz',
    description: null
  },
  {
    uri: 'http://www.wikidata.org/entity/Q55',
    coordinates: { lat: 52.316666666, lng: 5.55 },
    label: 'Hà Lan',
    description: null
  },
  {
    uri: 'http://www.wikidata.org/entity/Q55',
    coordinates: { lat: 52.316666666, lng: 5.55 },
    label: 'Hò-làn',
    description: null
  },
  {
    uri: 'http://www.wikidata.org/entity/Q55',
    coordinates: { lat: 52.316666666, lng: 5.55 },
    label: 'Hò̤-làng',
    description: null
  },
  {
    uri: 'http://www.wikidata.org/entity/Q55',
    coordinates: { lat: 52.316666666, lng: 5.55 },
    label: 'Hôlanê',
    description: null
  },
  {
    uri: 'http://www.wikidata.org/entity/Q55',
    coordinates: { lat: 52.316666666, lng: 5.55 },
    label: 'Hōlani',
    description: null
  },
  {
    uri: 'http://www.wikidata.org/entity/Q55',
    coordinates: { lat: 52.316666666, lng: 5.55 },
    label: 'Hōrana',
    description: null
  },
  {
    uri: 'http://www.wikidata.org/entity/Q55',
    coordinates: { lat: 52.316666666, lng: 5.55 },
    label: 'Hōrane',
    description: null
  },
  {
    uri: 'http://www.wikidata.org/entity/Q55',
    coordinates: { lat: 52.316666666, lng: 5.55 },
    label: 'IDashi',
    description: null
  },
  {
    uri: 'http://www.wikidata.org/entity/Q55',
    coordinates: { lat: 52.316666666, lng: 5.55 },
    label: 'Iseldiryow',
    description: null
  },
  {
    uri: 'http://www.wikidata.org/entity/Q55',
    coordinates: { lat: 52.316666666, lng: 5.55 },
    label: 'Izelvroioù',
    description: null
  },
  {
    uri: 'http://www.wikidata.org/entity/Q55',
    coordinates: { lat: 52.316666666, lng: 5.55 },
    label: 'Kéyah Wóyahgo Siʼánígíí',
    description: null
  },
  {
    uri: 'http://www.wikidata.org/entity/Q55',
    coordinates: { lat: 52.316666666, lng: 5.55 },
    label: 'Kē-tē-kok',
    description: null
  },
  {
    uri: 'http://www.wikidata.org/entity/Q55',
    coordinates: { lat: 52.316666666, lng: 5.55 },
    label: 'Landa',
    description: null
  },
  {
    uri: 'http://www.wikidata.org/entity/Q55',
    coordinates: { lat: 52.316666666, lng: 5.55 },
    label: 'Logos Bascios',
    description: null
  },
  {
    uri: 'http://www.wikidata.org/entity/Q55',
    coordinates: { lat: 52.316666666, lng: 5.55 },
    label: 'Madālmōd',
    description: null
  },
  {
    uri: 'http://www.wikidata.org/entity/Q55',
    coordinates: { lat: 52.316666666, lng: 5.55 },
    label: 'Na Tìrean Ìsle',
    description: null
  },
  {
    uri: 'http://www.wikidata.org/entity/Q55',
    coordinates: { lat: 52.316666666, lng: 5.55 },
    label: 'Nadalaunt',
    description: null
  },
  {
    uri: 'http://www.wikidata.org/entity/Q55',
    coordinates: { lat: 52.316666666, lng: 5.55 },
    label: 'Nedalanz',
    description: null
  },
  {
    uri: 'http://www.wikidata.org/entity/Q55',
    coordinates: { lat: 52.316666666, lng: 5.55 },
    label: 'Nedderlannen',
    description: null
  },
  {
    uri: 'http://www.wikidata.org/entity/Q55',
    coordinates: { lat: 52.316666666, lng: 5.55 },
    label: 'Nederlaand',
    description: null
  },
  {
    uri: 'http://www.wikidata.org/entity/Q55',
    coordinates: { lat: 52.316666666, lng: 5.55 },
    label: 'Nederland',
    description: null
  },
  {
    uri: 'http://www.wikidata.org/entity/Q55',
    coordinates: { lat: 52.316666666, lng: 5.55 },
    label: 'Nederland',
    description: null
  },
  {
    uri: 'http://www.wikidata.org/entity/Q55',
    coordinates: { lat: 52.316666666, lng: 5.55 },
    label: 'Nederland',
    description: null
  },
  {
    uri: 'http://www.wikidata.org/entity/Q55',
    coordinates: { lat: 52.316666666, lng: 5.55 },
    label: 'Nederland',
    description: null
  },
  {
    uri: 'http://www.wikidata.org/entity/Q55',
    coordinates: { lat: 52.316666666, lng: 5.55 },
    label: 'Nederland',
    description: null
  },
  {
    uri: 'http://www.wikidata.org/entity/Q55',
    coordinates: { lat: 52.316666666, lng: 5.55 },
    label: 'Nederland',
    description: null
  },
  {
    uri: 'http://www.wikidata.org/entity/Q55',
    coordinates: { lat: 52.316666666, lng: 5.55 },
    label: 'Nederland',
    description: null
  },
  {
    uri: 'http://www.wikidata.org/entity/Q55',
    coordinates: { lat: 52.316666666, lng: 5.55 },
    label: 'Nederland',
    description: null
  },
  {
    uri: 'http://www.wikidata.org/entity/Q55',
    coordinates: { lat: 52.316666666, lng: 5.55 },
    label: 'Nederlande',
    description: null
  },
  {
    uri: 'http://www.wikidata.org/entity/Q55',
    coordinates: { lat: 52.316666666, lng: 5.55 },
    label: 'Nederlandes',
    description: null
  },
  {
    uri: 'http://www.wikidata.org/entity/Q55',
    coordinates: { lat: 52.316666666, lng: 5.55 },
    label: 'Nederlandia',
    description: null
  },
  {
    uri: 'http://www.wikidata.org/entity/Q55',
    coordinates: { lat: 52.316666666, lng: 5.55 },
    label: 'Nederlandia',
    description: null
  },
  {
    uri: 'http://www.wikidata.org/entity/Q55',
    coordinates: { lat: 52.316666666, lng: 5.55 },
    label: 'Nederlando',
    description: null
  },
  {
    uri: 'http://www.wikidata.org/entity/Q55',
    coordinates: { lat: 52.316666666, lng: 5.55 },
    label: 'Nederlando',
    description: null
  },
  {
    uri: 'http://www.wikidata.org/entity/Q55',
    coordinates: { lat: 52.316666666, lng: 5.55 },
    label: 'Nederlands',
    description: null
  },
  {
    uri: 'http://www.wikidata.org/entity/Q55',
    coordinates: { lat: 52.316666666, lng: 5.55 },
    label: 'Nederlandy',
    description: null
  },
  {
    uri: 'http://www.wikidata.org/entity/Q55',
    coordinates: { lat: 52.316666666, lng: 5.55 },
    label: 'Nederlân',
    description: null
  },
  {
    uri: 'http://www.wikidata.org/entity/Q55',
    coordinates: { lat: 52.316666666, lng: 5.55 },
    label: 'Nederländerna',
    description: null
  },
  {
    uri: 'http://www.wikidata.org/entity/Q55',
    coordinates: { lat: 52.316666666, lng: 5.55 },
    label: 'Nederlönje',
    description: null
  },
  {
    uri: 'http://www.wikidata.org/entity/Q55',
    coordinates: { lat: 52.316666666, lng: 5.55 },
    label: 'Nedän',
    description: null
  },
  {
    uri: 'http://www.wikidata.org/entity/Q55',
    coordinates: { lat: 52.316666666, lng: 5.55 },
    label: 'Neezerlaandi',
    description: null
  },
  {
    uri: 'http://www.wikidata.org/entity/Q55',
    coordinates: { lat: 52.316666666, lng: 5.55 },
    label: 'Netalani',
    description: null
  },
  {
    uri: 'http://www.wikidata.org/entity/Q55',
    coordinates: { lat: 52.316666666, lng: 5.55 },
    label: 'Netherlands',
    description: null
  },
  {
    uri: 'http://www.wikidata.org/entity/Q55',
    coordinates: { lat: 52.316666666, lng: 5.55 },
    label: 'Netherlands',
    description: null
  },
  {
    uri: 'http://www.wikidata.org/entity/Q55',
    coordinates: { lat: 52.316666666, lng: 5.55 },
    label: 'Netherlands',
    description: null
  },
  {
    uri: 'http://www.wikidata.org/entity/Q55',
    coordinates: { lat: 52.316666666, lng: 5.55 },
    label: 'Netherlands',
    description: null
  },
  {
    uri: 'http://www.wikidata.org/entity/Q55',
    coordinates: { lat: 52.316666666, lng: 5.55 },
    label: 'Netherlands',
    description: null
  },
  {
    uri: 'http://www.wikidata.org/entity/Q55',
    coordinates: { lat: 52.316666666, lng: 5.55 },
    label: 'Netherlands',
    description: null
  },
  {
    uri: 'http://www.wikidata.org/entity/Q55',
    coordinates: { lat: 52.316666666, lng: 5.55 },
    label: 'Netherlands',
    description: null
  },
  {
    uri: 'http://www.wikidata.org/entity/Q55',
    coordinates: { lat: 52.316666666, lng: 5.55 },
    label: 'Netherlands',
    description: null
  },
  {
    uri: 'http://www.wikidata.org/entity/Q55',
    coordinates: { lat: 52.316666666, lng: 5.55 },
    label: 'Netherlands',
    description: null
  },
  {
    uri: 'http://www.wikidata.org/entity/Q55',
    coordinates: { lat: 52.316666666, lng: 5.55 },
    label: 'Netherlands',
    description: null
  },
  {
    uri: 'http://www.wikidata.org/entity/Q55',
    coordinates: { lat: 52.316666666, lng: 5.55 },
    label: 'Netherlands',
    description: null
  },
  {
    uri: 'http://www.wikidata.org/entity/Q55',
    coordinates: { lat: 52.316666666, lng: 5.55 },
    label: 'Netherlands',
    description: null
  },
  {
    uri: 'http://www.wikidata.org/entity/Q55',
    coordinates: { lat: 52.316666666, lng: 5.55 },
    label: 'Netherlands',
    description: null
  },
  {
    uri: 'http://www.wikidata.org/entity/Q55',
    coordinates: { lat: 52.316666666, lng: 5.55 },
    label: 'Netherlands',
    description: null
  },
  {
    uri: 'http://www.wikidata.org/entity/Q55',
    coordinates: { lat: 52.316666666, lng: 5.55 },
    label: 'Netherlands',
    description: null
  },
  {
    uri: 'http://www.wikidata.org/entity/Q55',
    coordinates: { lat: 52.316666666, lng: 5.55 },
    label: 'Netherlands',
    description: null
  },
  {
    uri: 'http://www.wikidata.org/entity/Q55',
    coordinates: { lat: 52.316666666, lng: 5.55 },
    label: 'Netherlands',
    description: null
  },
  {
    uri: 'http://www.wikidata.org/entity/Q55',
    coordinates: { lat: 52.316666666, lng: 5.55 },
    label: 'Netherlands',
    description: null
  },
  {
    uri: 'http://www.wikidata.org/entity/Q55',
    coordinates: { lat: 52.316666666, lng: 5.55 },
    label: 'Netherlands',
    description: null
  },
  {
    uri: 'http://www.wikidata.org/entity/Q55',
    coordinates: { lat: 52.316666666, lng: 5.55 },
    label: 'Niderland',
    description: null
  },
  {
    uri: 'http://www.wikidata.org/entity/Q55',
    coordinates: { lat: 52.316666666, lng: 5.55 },
    label: 'Niderland',
    description: null
  },
  {
    uri: 'http://www.wikidata.org/entity/Q55',
    coordinates: { lat: 52.316666666, lng: 5.55 },
    label: 'Niderland',
    description: null
  },
  {
    uri: 'http://www.wikidata.org/entity/Q55',
    coordinates: { lat: 52.316666666, lng: 5.55 },
    label: 'Niderlandiya',
    description: null
  },
  {
    uri: 'http://www.wikidata.org/entity/Q55',
    coordinates: { lat: 52.316666666, lng: 5.55 },
    label: 'Niderlandlar',
    description: null
  },
  {
    uri: 'http://www.wikidata.org/entity/Q55',
    coordinates: { lat: 52.316666666, lng: 5.55 },
    label: 'Niderlandlar',
    description: null
  },
  {
    uri: 'http://www.wikidata.org/entity/Q55',
    coordinates: { lat: 52.316666666, lng: 5.55 },
    label: 'Niederlande',
    description: null
  },
  {
    uri: 'http://www.wikidata.org/entity/Q55',
    coordinates: { lat: 52.316666666, lng: 5.55 },
    label: 'Niederlande',
    description: null
  },
  {
    uri: 'http://www.wikidata.org/entity/Q55',
    coordinates: { lat: 52.316666666, lng: 5.55 },
    label: 'Niederlande',
    description: null
  },
  {
    uri: 'http://www.wikidata.org/entity/Q55',
    coordinates: { lat: 52.316666666, lng: 5.55 },
    label: 'Niederlande',
    description: null
  },
  {
    uri: 'http://www.wikidata.org/entity/Q55',
    coordinates: { lat: 52.316666666, lng: 5.55 },
    label: 'Niederlande',
    description: null
  },
  {
    uri: 'http://www.wikidata.org/entity/Q55',
    coordinates: { lat: 52.316666666, lng: 5.55 },
    label: 'Niederlounde',
    description: null
  },
  {
    uri: 'http://www.wikidata.org/entity/Q55',
    coordinates: { lat: 52.316666666, lng: 5.55 },
    label: 'Nizozemska',
    description: null
  },
  {
    uri: 'http://www.wikidata.org/entity/Q55',
    coordinates: { lat: 52.316666666, lng: 5.55 },
    label: 'Nizozemska',
    description: null
  },
  {
    uri: 'http://www.wikidata.org/entity/Q55',
    coordinates: { lat: 52.316666666, lng: 5.55 },
    label: 'Nizozemsko',
    description: null
  },
  {
    uri: 'http://www.wikidata.org/entity/Q55',
    coordinates: { lat: 52.316666666, lng: 5.55 },
    label: 'Niðerland',
    description: null
  },
  {
    uri: 'http://www.wikidata.org/entity/Q55',
    coordinates: { lat: 52.316666666, lng: 5.55 },
    label: 'Niðurlond',
    description: null
  },
  {
    uri: 'http://www.wikidata.org/entity/Q55',
    coordinates: { lat: 52.316666666, lng: 5.55 },
    label: 'Nižozemska',
    description: null
  },
  {
    uri: 'http://www.wikidata.org/entity/Q55',
    coordinates: { lat: 52.316666666, lng: 5.55 },
    label: 'Nižozemska',
    description: null
  },
  {
    uri: 'http://www.wikidata.org/entity/Q55',
    coordinates: { lat: 52.316666666, lng: 5.55 },
    label: 'Nyderlandai',
    description: null
  },
  {
    uri: 'http://www.wikidata.org/entity/Q55',
    coordinates: { lat: 52.316666666, lng: 5.55 },
    label: 'Néderlandzkô',
    description: null
  },
  {
    uri: 'http://www.wikidata.org/entity/Q55',
    coordinates: { lat: 52.316666666, lng: 5.55 },
    label: 'Nīderlande',
    description: null
  },
  {
    uri: 'http://www.wikidata.org/entity/Q55',
    coordinates: { lat: 52.316666666, lng: 5.55 },
    label: 'Nīderlandeja',
    description: null
  },
  {
    uri: 'http://www.wikidata.org/entity/Q55',
    coordinates: { lat: 52.316666666, lng: 5.55 },
    label: 'Nīderlandā',
    description: null
  },
  {
    uri: 'http://www.wikidata.org/entity/Q55',
    coordinates: { lat: 52.316666666, lng: 5.55 },
    label: 'Nẹ́dálándì',
    description: null
  },
  {
    uri: 'http://www.wikidata.org/entity/Q55',
    coordinates: { lat: 52.316666666, lng: 5.55 },
    label: 'Ol Nitelan',
    description: null
  },
  {
    uri: 'http://www.wikidata.org/entity/Q55',
    coordinates: { lat: 52.316666666, lng: 5.55 },
    label: 'Olaand',
    description: null
  },
  {
    uri: 'http://www.wikidata.org/entity/Q55',
    coordinates: { lat: 52.316666666, lng: 5.55 },
    label: 'Olanda',
    description: null
  },
  {
    uri: 'http://www.wikidata.org/entity/Q55',
    coordinates: { lat: 52.316666666, lng: 5.55 },
    label: 'Olanda',
    description: null
  },
  {
    uri: 'http://www.wikidata.org/entity/Q55',
    coordinates: { lat: 52.316666666, lng: 5.55 },
    label: 'Olanda',
    description: null
  },
  {
    uri: 'http://www.wikidata.org/entity/Q55',
    coordinates: { lat: 52.316666666, lng: 5.55 },
    label: 'Olanda',
    description: null
  },
  {
    uri: 'http://www.wikidata.org/entity/Q55',
    coordinates: { lat: 52.316666666, lng: 5.55 },
    label: 'Olánda',
    description: null
  },
  {
    uri: 'http://www.wikidata.org/entity/Q55',
    coordinates: { lat: 52.316666666, lng: 5.55 },
    label: 'Paes Bass',
    description: null
  },
  {
    uri: 'http://www.wikidata.org/entity/Q55',
    coordinates: { lat: 52.316666666, lng: 5.55 },
    label: 'Paesi Bassi',
    description: null
  },
  {
    uri: 'http://www.wikidata.org/entity/Q55',
    coordinates: { lat: 52.316666666, lng: 5.55 },
    label: 'Paesi Bassi',
    description: null
  },
  {
    uri: 'http://www.wikidata.org/entity/Q55',
    coordinates: { lat: 52.316666666, lng: 5.55 },
    label: 'Pais Bass',
    description: null
  },
  {
    uri: 'http://www.wikidata.org/entity/Q55',
    coordinates: { lat: 52.316666666, lng: 5.55 },
    label: 'Paises Bahes',
    description: null
  },
  {
    uri: 'http://www.wikidata.org/entity/Q55',
    coordinates: { lat: 52.316666666, lng: 5.55 },
    label: 'Paisi Vasci',
    description: null
  },
  {
    uri: 'http://www.wikidata.org/entity/Q55',
    coordinates: { lat: 52.316666666, lng: 5.55 },
    label: 'Paisis Baxus',
    description: null
  },
  {
    uri: 'http://www.wikidata.org/entity/Q55',
    coordinates: { lat: 52.316666666, lng: 5.55 },
    label: 'Paixi Basci',
    description: null
  },
  {
    uri: 'http://www.wikidata.org/entity/Q55',
    coordinates: { lat: 52.316666666, lng: 5.55 },
    label: 'Pajais Bass',
    description: null
  },
  {
    uri: 'http://www.wikidata.org/entity/Q55',
    coordinates: { lat: 52.316666666, lng: 5.55 },
    label: 'Pajjiżi l-Baxxi',
    description: null
  },
  {
    uri: 'http://www.wikidata.org/entity/Q55',
    coordinates: { lat: 52.316666666, lng: 5.55 },
    label: 'Pajèsere Vasce',
    description: null
  },
  {
    uri: 'http://www.wikidata.org/entity/Q55',
    coordinates: { lat: 52.316666666, lng: 5.55 },
    label: 'Payis-Bâs',
    description: null
  },
  {
    uri: 'http://www.wikidata.org/entity/Q55',
    coordinates: { lat: 52.316666666, lng: 5.55 },
    label: 'Payises Bashos',
    description: null
  },
  {
    uri: 'http://www.wikidata.org/entity/Q55',
    coordinates: { lat: 52.316666666, lng: 5.55 },
    label: 'Pays Bas',
    description: null
  },
  {
    uri: 'http://www.wikidata.org/entity/Q55',
    coordinates: { lat: 52.316666666, lng: 5.55 },
    label: 'Pays-Bas',
    description: null
  },
  {
    uri: 'http://www.wikidata.org/entity/Q55',
    coordinates: { lat: 52.316666666, lng: 5.55 },
    label: 'Pays-Bas',
    description: null
  },
  {
    uri: 'http://www.wikidata.org/entity/Q55',
    coordinates: { lat: 52.316666666, lng: 5.55 },
    label: 'Paéxi Basi',
    description: null
  },
  {
    uri: 'http://www.wikidata.org/entity/Q55',
    coordinates: { lat: 52.316666666, lng: 5.55 },
    label: 'Países Baixos',
    description: null
  },
  {
    uri: 'http://www.wikidata.org/entity/Q55',
    coordinates: { lat: 52.316666666, lng: 5.55 },
    label: 'Países Baixos',
    description: null
  },
  {
    uri: 'http://www.wikidata.org/entity/Q55',
    coordinates: { lat: 52.316666666, lng: 5.55 },
    label: 'Países Baixos',
    description: null
  },
  {
    uri: 'http://www.wikidata.org/entity/Q55',
    coordinates: { lat: 52.316666666, lng: 5.55 },
    label: 'Países Baixos',
    description: null
  },
  {
    uri: 'http://www.wikidata.org/entity/Q55',
    coordinates: { lat: 52.316666666, lng: 5.55 },
    label: 'Países Bajos',
    description: null
  },
  {
    uri: 'http://www.wikidata.org/entity/Q55',
    coordinates: { lat: 52.316666666, lng: 5.55 },
    label: 'Países Baxos',
    description: null
  },
  {
    uri: 'http://www.wikidata.org/entity/Q55',
    coordinates: { lat: 52.316666666, lng: 5.55 },
    label: 'Paîs Bas',
    description: null
  },
  {
    uri: 'http://www.wikidata.org/entity/Q55',
    coordinates: { lat: 52.316666666, lng: 5.55 },
    label: 'Païses Basses',
    description: null
  },
  {
    uri: 'http://www.wikidata.org/entity/Q55',
    coordinates: { lat: 52.316666666, lng: 5.55 },
    label: 'Països Baixos',
    description: null
  },
  {
    uri: 'http://www.wikidata.org/entity/Q55',
    coordinates: { lat: 52.316666666, lng: 5.55 },
    label: 'Peyiba',
    description: null
  },
  {
    uri: 'http://www.wikidata.org/entity/Q55',
    coordinates: { lat: 52.316666666, lng: 5.55 },
    label: 'Peyibaa',
    description: null
  },
  {
    uri: 'http://www.wikidata.org/entity/Q55',
    coordinates: { lat: 52.316666666, lng: 5.55 },
    label: 'The Netherlands',
    description: null
  },
  {
    uri: 'http://www.wikidata.org/entity/Q55',
    coordinates: { lat: 52.316666666, lng: 5.55 },
    label: 'Timura n Wadda',
    description: null
  },
  {
    uri: 'http://www.wikidata.org/entity/Q55',
    coordinates: { lat: 52.316666666, lng: 5.55 },
    label: 'Tlanitlālpan',
    description: null
  },
  {
    uri: 'http://www.wikidata.org/entity/Q55',
    coordinates: { lat: 52.316666666, lng: 5.55 },
    label: 'Ubuholandi',
    description: null
  },
  {
    uri: 'http://www.wikidata.org/entity/Q55',
    coordinates: { lat: 52.316666666, lng: 5.55 },
    label: 'Uholanzi',
    description: null
  },
  {
    uri: 'http://www.wikidata.org/entity/Q55',
    coordinates: { lat: 52.316666666, lng: 5.55 },
    label: 'Ulanna',
    description: null
  },
  {
    uri: 'http://www.wikidata.org/entity/Q55',
    coordinates: { lat: 52.316666666, lng: 5.55 },
    label: 'Ulànda',
    description: null
  },
  {
    uri: 'http://www.wikidata.org/entity/Q55',
    coordinates: { lat: 52.316666666, lng: 5.55 },
    label: 'Urasuyu',
    description: null
  },
  {
    uri: 'http://www.wikidata.org/entity/Q55',
    coordinates: { lat: 52.316666666, lng: 5.55 },
    label: 'Vuelielaanteh',
    description: null
  },
  {
    uri: 'http://www.wikidata.org/entity/Q55',
    coordinates: { lat: 52.316666666, lng: 5.55 },
    label: 'Vuolleeatnamat',
    description: null
  },
  {
    uri: 'http://www.wikidata.org/entity/Q55',
    coordinates: { lat: 52.316666666, lng: 5.55 },
    label: 'Walanda',
    description: null
  },
  {
    uri: 'http://www.wikidata.org/entity/Q55',
    coordinates: { lat: 52.316666666, lng: 5.55 },
    label: 'Walanda',
    description: null
  },
  {
    uri: 'http://www.wikidata.org/entity/Q55',
    coordinates: { lat: 52.316666666, lng: 5.55 },
    label: 'Walanda',
    description: null
  },
  {
    uri: 'http://www.wikidata.org/entity/Q55',
    coordinates: { lat: 52.316666666, lng: 5.55 },
    label: 'Walanta',
    description: null
  },
  {
    uri: 'http://www.wikidata.org/entity/Q55',
    coordinates: { lat: 52.316666666, lng: 5.55 },
    label: 'Yn Çheer Injil',
    description: null
  },
  {
    uri: 'http://www.wikidata.org/entity/Q55',
    coordinates: { lat: 52.316666666, lng: 5.55 },
    label: 'Yr Iseldiroedd',
    description: null
  },
  {
    uri: 'http://www.wikidata.org/entity/Q55',
    coordinates: { lat: 52.316666666, lng: 5.55 },
    label: 'la nederland',
    description: null
  },
  {
    uri: 'http://www.wikidata.org/entity/Q55',
    coordinates: { lat: 52.316666666, lng: 5.55 },
    label: 'ประเทศเนเธอร์แลนด์',
    description: null
  },
  {
    uri: 'http://www.wikidata.org/entity/Q55',
    coordinates: { lat: 52.316666666, lng: 5.55 },
    label: 'Ńiderlandy',
    description: null
  },
  {
    uri: 'http://www.wikidata.org/entity/Q55',
    coordinates: { lat: 52.316666666, lng: 5.55 },
    label: 'Țările de Jos',
    description: null
  },
  {
    uri: 'http://www.wikidata.org/entity/Q55',
    coordinates: { lat: 52.316666666, lng: 5.55 },
    label: 'Ολλανδία',
    description: null
  },
  {
    uri: 'http://www.wikidata.org/entity/Q55',
    coordinates: { lat: 52.316666666, lng: 5.55 },
    label: 'Ολλανδία',
    description: null
  },
  {
    uri: 'http://www.wikidata.org/entity/Q55',
    coordinates: { lat: 52.316666666, lng: 5.55 },
    label: 'Голланди',
    description: null
  },
  {
    uri: 'http://www.wikidata.org/entity/Q55',
    coordinates: { lat: 52.316666666, lng: 5.55 },
    label: 'Недерланд',
    description: null
  },
  {
    uri: 'http://www.wikidata.org/entity/Q55',
    coordinates: { lat: 52.316666666, lng: 5.55 },
    label: 'Недерланд',
    description: null
  },
  {
    uri: 'http://www.wikidata.org/entity/Q55',
    coordinates: { lat: 52.316666666, lng: 5.55 },
    label: 'Недерлантт',
    description: null
  },
  {
    uri: 'http://www.wikidata.org/entity/Q55',
    coordinates: { lat: 52.316666666, lng: 5.55 },
    label: 'Недерлендин Нутг',
    description: null
  },
  {
    uri: 'http://www.wikidata.org/entity/Q55',
    coordinates: { lat: 52.316666666, lng: 5.55 },
    label: 'Нидерланд',
    description: null
  },
  {
    uri: 'http://www.wikidata.org/entity/Q55',
    coordinates: { lat: 52.316666666, lng: 5.55 },
    label: 'Нидерланд',
    description: null
  },
  {
    uri: 'http://www.wikidata.org/entity/Q55',
    coordinates: { lat: 52.316666666, lng: 5.55 },
    label: 'Нидерланд',
    description: null
  },
  {
    uri: 'http://www.wikidata.org/entity/Q55',
    coordinates: { lat: 52.316666666, lng: 5.55 },
    label: 'Нидерланд',
    description: null
  },
  {
    uri: 'http://www.wikidata.org/entity/Q55',
    coordinates: { lat: 52.316666666, lng: 5.55 },
    label: 'Нидерланд',
    description: null
  },
  {
    uri: 'http://www.wikidata.org/entity/Q55',
    coordinates: { lat: 52.316666666, lng: 5.55 },
    label: 'Нидерландал',
    description: null
  },
  {
    uri: 'http://www.wikidata.org/entity/Q55',
    coordinates: { lat: 52.316666666, lng: 5.55 },
    label: 'Нидерландар',
    description: null
  },
  {
    uri: 'http://www.wikidata.org/entity/Q55',
    coordinates: { lat: 52.316666666, lng: 5.55 },
    label: 'Нидерландаш',
    description: null
  },
  {
    uri: 'http://www.wikidata.org/entity/Q55',
    coordinates: { lat: 52.316666666, lng: 5.55 },
    label: 'Нидерланде',
    description: null
  },
  {
    uri: 'http://www.wikidata.org/entity/Q55',
    coordinates: { lat: 52.316666666, lng: 5.55 },
    label: 'Нидерландия',
    description: null
  },
  {
    uri: 'http://www.wikidata.org/entity/Q55',
    coordinates: { lat: 52.316666666, lng: 5.55 },
    label: 'Нидерландла',
    description: null
  },
  {
    uri: 'http://www.wikidata.org/entity/Q55',
    coordinates: { lat: 52.316666666, lng: 5.55 },
    label: 'Нидерландлар',
    description: null
  },
  {
    uri: 'http://www.wikidata.org/entity/Q55',
    coordinates: { lat: 52.316666666, lng: 5.55 },
    label: 'Нидерландсем',
    description: null
  },
  {
    uri: 'http://www.wikidata.org/entity/Q55',
    coordinates: { lat: 52.316666666, lng: 5.55 },
    label: 'Нидерландтæ',
    description: null
  },
  {
    uri: 'http://www.wikidata.org/entity/Q55',
    coordinates: { lat: 52.316666666, lng: 5.55 },
    label: 'Нидерландтар',
    description: null
  },
  {
    uri: 'http://www.wikidata.org/entity/Q55',
    coordinates: { lat: 52.316666666, lng: 5.55 },
    label: 'Нидерландтар',
    description: null
  },
  {
    uri: 'http://www.wikidata.org/entity/Q55',
    coordinates: { lat: 52.316666666, lng: 5.55 },
    label: 'Нидерландъяс',
    description: null
  },
  {
    uri: 'http://www.wikidata.org/entity/Q55',
    coordinates: { lat: 52.316666666, lng: 5.55 },
    label: 'Нидерланды',
    description: null
  },
  {
    uri: 'http://www.wikidata.org/entity/Q55',
    coordinates: { lat: 52.316666666, lng: 5.55 },
    label: 'Нидерланды',
    description: null
  },
  {
    uri: 'http://www.wikidata.org/entity/Q55',
    coordinates: { lat: 52.316666666, lng: 5.55 },
    label: 'Нидерлэндхэр',
    description: null
  },
  {
    uri: 'http://www.wikidata.org/entity/Q55',
    coordinates: { lat: 52.316666666, lng: 5.55 },
    label: 'Нидирлан',
    description: null
  },
  {
    uri: 'http://www.wikidata.org/entity/Q55',
    coordinates: { lat: 52.316666666, lng: 5.55 },
    label: 'Нидирланд',
    description: null
  },
  {
    uri: 'http://www.wikidata.org/entity/Q55',
    coordinates: { lat: 52.316666666, lng: 5.55 },
    label: 'Нидєрландꙑ',
    description: null
  },
  {
    uri: 'http://www.wikidata.org/entity/Q55',
    coordinates: { lat: 52.316666666, lng: 5.55 },
    label: 'Нідерланди',
    description: null
  },
  {
    uri: 'http://www.wikidata.org/entity/Q55',
    coordinates: { lat: 52.316666666, lng: 5.55 },
    label: 'Нідерланды',
    description: null
  },
  {
    uri: 'http://www.wikidata.org/entity/Q55',
    coordinates: { lat: 52.316666666, lng: 5.55 },
    label: 'Нідэрланды',
    description: null
  },
  {
    uri: 'http://www.wikidata.org/entity/Q55',
    coordinates: { lat: 52.316666666, lng: 5.55 },
    label: 'Нідэрлянды',
    description: null
  },
  {
    uri: 'http://www.wikidata.org/entity/Q55',
    coordinates: { lat: 52.316666666, lng: 5.55 },
    label: 'Холандија',
    description: null
  },
  {
    uri: 'http://www.wikidata.org/entity/Q55',
    coordinates: { lat: 52.316666666, lng: 5.55 },
    label: 'Холандија',
    description: null
  },
  {
    uri: 'http://www.wikidata.org/entity/Q55',
    coordinates: { lat: 52.316666666, lng: 5.55 },
    label: 'Холандија',
    description: null
  },
  {
    uri: 'http://www.wikidata.org/entity/Q55',
    coordinates: { lat: 52.316666666, lng: 5.55 },
    label: 'Նիդերլանդներ',
    description: null
  },
  {
    uri: 'http://www.wikidata.org/entity/Q55',
    coordinates: { lat: 52.316666666, lng: 5.55 },
    label: 'האלאנד',
    description: null
  },
  {
    uri: 'http://www.wikidata.org/entity/Q55',
    coordinates: { lat: 52.316666666, lng: 5.55 },
    label: 'הולנד',
    description: null
  },
  {
    uri: 'http://www.wikidata.org/entity/Q55',
    coordinates: { lat: 52.316666666, lng: 5.55 },
    label: 'نيدرلينڊز',
    description: null
  },
  {
    uri: 'http://www.wikidata.org/entity/Q55',
    coordinates: { lat: 52.316666666, lng: 5.55 },
    label: 'نيديرلاند',
    description: null
  },
  {
    uri: 'http://www.wikidata.org/entity/Q55',
    coordinates: { lat: 52.316666666, lng: 5.55 },
    label: 'نیدرلینڈز',
    description: null
  },
  {
    uri: 'http://www.wikidata.org/entity/Q55',
    coordinates: { lat: 52.316666666, lng: 5.55 },
    label: 'نیدرلینڈز',
    description: null
  },
  {
    uri: 'http://www.wikidata.org/entity/Q55',
    coordinates: { lat: 52.316666666, lng: 5.55 },
    label: 'هالنڈ',
    description: null
  },
  {
    uri: 'http://www.wikidata.org/entity/Q55',
    coordinates: { lat: 52.316666666, lng: 5.55 },
    label: 'هالنډ',
    description: null
  },
  {
    uri: 'http://www.wikidata.org/entity/Q55',
    coordinates: { lat: 52.316666666, lng: 5.55 },
    label: 'هلند',
    description: null
  },
  {
    uri: 'http://www.wikidata.org/entity/Q55',
    coordinates: { lat: 52.316666666, lng: 5.55 },
    label: 'هلند',
    description: null
  },
  {
    uri: 'http://www.wikidata.org/entity/Q55',
    coordinates: { lat: 52.316666666, lng: 5.55 },
    label: 'هلند',
    description: null
  },
  {
    uri: 'http://www.wikidata.org/entity/Q55',
    coordinates: { lat: 52.316666666, lng: 5.55 },
    label: 'هولند',
    description: null
  },
  {
    uri: 'http://www.wikidata.org/entity/Q55',
    coordinates: { lat: 52.316666666, lng: 5.55 },
    label: 'هولندا',
    description: null
  },
  {
    uri: 'http://www.wikidata.org/entity/Q55',
    coordinates: { lat: 52.316666666, lng: 5.55 },
    label: 'گوللاندىيە',
    description: null
  },
  {
    uri: 'http://www.wikidata.org/entity/Q55',
    coordinates: { lat: 52.316666666, lng: 5.55 },
    label: 'ھۆلەند',
    description: null
  },
  {
    uri: 'http://www.wikidata.org/entity/Q55',
    coordinates: { lat: 52.316666666, lng: 5.55 },
    label: 'ܗܘܠܢܕܐ',
    description: null
  },
  {
    uri: 'http://www.wikidata.org/entity/Q55',
    coordinates: { lat: 52.316666666, lng: 5.55 },
    label: 'ނެދަލޭންޑު',
    description: null
  },
  {
    uri: 'http://www.wikidata.org/entity/Q55',
    coordinates: { lat: 52.316666666, lng: 5.55 },
    label: 'नीदरलैंड',
    description: null
  },
  {
    uri: 'http://www.wikidata.org/entity/Q55',
    coordinates: { lat: 52.316666666, lng: 5.55 },
    label: 'नीदरलैण्ड',
    description: null
  },
  {
    uri: 'http://www.wikidata.org/entity/Q55',
    coordinates: { lat: 52.316666666, lng: 5.55 },
    label: 'नेदरलँड्स',
    description: null
  },
  {
    uri: 'http://www.wikidata.org/entity/Q55',
    coordinates: { lat: 52.316666666, lng: 5.55 },
    label: 'नेदरलँड्स',
    description: null
  },
  {
    uri: 'http://www.wikidata.org/entity/Q55',
    coordinates: { lat: 52.316666666, lng: 5.55 },
    label: 'नेदरलँड्स',
    description: null
  },
  {
    uri: 'http://www.wikidata.org/entity/Q55',
    coordinates: { lat: 52.316666666, lng: 5.55 },
    label: 'नेदरलैंड्स',
    description: null
  },
  {
    uri: 'http://www.wikidata.org/entity/Q55',
    coordinates: { lat: 52.316666666, lng: 5.55 },
    label: 'नेदरलैंड्स',
    description: null
  },
  {
    uri: 'http://www.wikidata.org/entity/Q55',
    coordinates: { lat: 52.316666666, lng: 5.55 },
    label: 'नेदरल्याण्ड्स',
    description: null
  },
  {
    uri: 'http://www.wikidata.org/entity/Q55',
    coordinates: { lat: 52.316666666, lng: 5.55 },
    label: 'नेदरल्यान्ड',
    description: null
  },
  {
    uri: 'http://www.wikidata.org/entity/Q55',
    coordinates: { lat: 52.316666666, lng: 5.55 },
    label: 'नेदरल्यान्द्स्',
    description: null
  },
  {
    uri: 'http://www.wikidata.org/entity/Q55',
    coordinates: { lat: 52.316666666, lng: 5.55 },
    label: 'নেদারল্যান্ড',
    description: null
  },
  {
    uri: 'http://www.wikidata.org/entity/Q55',
    coordinates: { lat: 52.316666666, lng: 5.55 },
    label: 'নেদারল্যান্ডস',
    description: null
  },
  {
    uri: 'http://www.wikidata.org/entity/Q55',
    coordinates: { lat: 52.316666666, lng: 5.55 },
    label: 'ਨੀਦਰਲੈਂਡ',
    description: null
  },
  {
    uri: 'http://www.wikidata.org/entity/Q55',
    coordinates: { lat: 52.316666666, lng: 5.55 },
    label: 'નેધરલેંડ',
    description: null
  },
  {
    uri: 'http://www.wikidata.org/entity/Q55',
    coordinates: { lat: 52.316666666, lng: 5.55 },
    label: 'ନେଦରଲାଣ୍ଡ',
    description: null
  },
  {
    uri: 'http://www.wikidata.org/entity/Q55',
    coordinates: { lat: 52.316666666, lng: 5.55 },
    label: 'நெதர்லாந்து',
    description: null
  },
  {
    uri: 'http://www.wikidata.org/entity/Q55',
    coordinates: { lat: 52.316666666, lng: 5.55 },
    label: 'నెదర్లాండ్',
    description: null
  },
  {
    uri: 'http://www.wikidata.org/entity/Q55',
    coordinates: { lat: 52.316666666, lng: 5.55 },
    label: 'ನೆದರ್‍ಲ್ಯಾಂಡ್ಸ್',
    description: null
  },
  {
    uri: 'http://www.wikidata.org/entity/Q55',
    coordinates: { lat: 52.316666666, lng: 5.55 },
    label: 'നെതർലന്റ്സ്',
    description: null
  },
  {
    uri: 'http://www.wikidata.org/entity/Q55',
    coordinates: { lat: 52.316666666, lng: 5.55 },
    label: 'නෙදර්ලන්තය',
    description: null
  },
  {
    uri: 'http://www.wikidata.org/entity/Q55',
    coordinates: { lat: 52.316666666, lng: 5.55 },
    label: 'ປະເທດໂຮນລັງ',
    description: null
  },
  {
    uri: 'http://www.wikidata.org/entity/Q55',
    coordinates: { lat: 52.316666666, lng: 5.55 },
    label: 'ནེ་དར་ལེནཌསི་',
    description: null
  },
  {
    uri: 'http://www.wikidata.org/entity/Q55',
    coordinates: { lat: 52.316666666, lng: 5.55 },
    label: 'ཧོ་ལན།',
    description: null
  },
  {
    uri: 'http://www.wikidata.org/entity/Q55',
    coordinates: { lat: 52.316666666, lng: 5.55 },
    label: 'နယ်သာလန်နိုင်ငံ',
    description: null
  },
  {
    uri: 'http://www.wikidata.org/entity/Q55',
    coordinates: { lat: 52.316666666, lng: 5.55 },
    label: 'ნიდერლანდები',
    description: null
  },
  {
    uri: 'http://www.wikidata.org/entity/Q55',
    coordinates: { lat: 52.316666666, lng: 5.55 },
    label: 'ნიდერლანდი',
    description: null
  },
  {
    uri: 'http://www.wikidata.org/entity/Q55',
    coordinates: { lat: 52.316666666, lng: 5.55 },
    label: 'ሆላንድ',
    description: null
  },
  {
    uri: 'http://www.wikidata.org/entity/Q55',
    coordinates: { lat: 52.316666666, lng: 5.55 },
    label: 'ᏛᏥᏱ',
    description: null
  },
  {
    uri: 'http://www.wikidata.org/entity/Q55',
    coordinates: { lat: 52.316666666, lng: 5.55 },
    label: 'ប្រទេសហូឡង់',
    description: null
  },
  {
    uri: 'http://www.wikidata.org/entity/Q55',
    coordinates: { lat: 52.316666666, lng: 5.55 },
    label: 'ᱱᱮᱫᱟᱨᱞᱮᱱᱰᱥ',
    description: null
  },
  {
    uri: 'http://www.wikidata.org/entity/Q55',
    coordinates: { lat: 52.316666666, lng: 5.55 },
    label: 'オランダ',
    description: null
  },
  {
    uri: 'http://www.wikidata.org/entity/Q55',
    coordinates: { lat: 52.316666666, lng: 5.55 },
    label: '尼德兰',
    description: null
  },
  {
    uri: 'http://www.wikidata.org/entity/Q55',
    coordinates: { lat: 52.316666666, lng: 5.55 },
    label: '荷兰',
    description: null
  },
  {
    uri: 'http://www.wikidata.org/entity/Q55',
    coordinates: { lat: 52.316666666, lng: 5.55 },
    label: '荷兰',
    description: null
  },
  {
    uri: 'http://www.wikidata.org/entity/Q55',
    coordinates: { lat: 52.316666666, lng: 5.55 },
    label: '荷兰',
    description: null
  },
  {
    uri: 'http://www.wikidata.org/entity/Q55',
    coordinates: { lat: 52.316666666, lng: 5.55 },
    label: '荷兰',
    description: null
  },
  {
    uri: 'http://www.wikidata.org/entity/Q55',
    coordinates: { lat: 52.316666666, lng: 5.55 },
    label: '荷蘭',
    description: null
  },
  {
    uri: 'http://www.wikidata.org/entity/Q55',
    coordinates: { lat: 52.316666666, lng: 5.55 },
    label: '荷蘭',
    description: null
  },
  {
    uri: 'http://www.wikidata.org/entity/Q55',
    coordinates: { lat: 52.316666666, lng: 5.55 },
    label: '荷蘭',
    description: null
  },
  {
    uri: 'http://www.wikidata.org/entity/Q55',
    coordinates: { lat: 52.316666666, lng: 5.55 },
    label: '荷蘭',
    description: null
  },
  {
    uri: 'http://www.wikidata.org/entity/Q55',
    coordinates: { lat: 52.316666666, lng: 5.55 },
    label: '荷蘭',
    description: null
  },
  {
    uri: 'http://www.wikidata.org/entity/Q55',
    coordinates: { lat: 52.316666666, lng: 5.55 },
    label: '荷蘭',
    description: null
  },
  {
    uri: 'http://www.wikidata.org/entity/Q55',
    coordinates: { lat: 52.316666666, lng: 5.55 },
    label: '荷蘭',
    description: null
  },
  {
    uri: 'http://www.wikidata.org/entity/Q55',
    coordinates: { lat: 52.316666666, lng: 5.55 },
    label: '荷蘭',
    description: null
  },
  {
    uri: 'http://www.wikidata.org/entity/Q55',
    coordinates: { lat: 52.316666666, lng: 5.55 },
    label: '네덜란드',
    description: null
  },
  {
    uri: 'http://www.wikidata.org/entity/Q55',
    coordinates: { lat: 52.316666666, lng: 5.55 },
    label:
      '\uD800\uDF3D\uD800\uDF39\uD800\uDF38\uD800\uDF34\uD800\uDF42\uD800\uDF30\uD800\uDF3B\uD800\uDF30\uD800\uDF3D\uD800\uDF33',
    description: null
  },
  {
    uri: 'http://www.wikidata.org/entity/Q73065',
    coordinates: { lat: 53.1, lng: 6.883333333 },
    label: 'Feandam',
    description: null
  },
  {
    uri: 'http://www.wikidata.org/entity/Q73065',
    coordinates: { lat: 53.1, lng: 6.883333333 },
    label: 'Gemeente Veendam',
    description: null
  },
  {
    uri: 'http://www.wikidata.org/entity/Q73065',
    coordinates: { lat: 53.1, lng: 6.883333333 },
    label: 'Veendaam',
    description: null
  },
  {
    uri: 'http://www.wikidata.org/entity/Q73065',
    coordinates: { lat: 53.1, lng: 6.883333333 },
    label: 'Veendam',
    description: null
  },
  {
    uri: 'http://www.wikidata.org/entity/Q73065',
    coordinates: { lat: 53.1, lng: 6.883333333 },
    label: 'Veendam',
    description: null
  },
  {
    uri: 'http://www.wikidata.org/entity/Q73065',
    coordinates: { lat: 53.1, lng: 6.883333333 },
    label: 'Veendam',
    description: null
  },
  {
    uri: 'http://www.wikidata.org/entity/Q73065',
    coordinates: { lat: 53.1, lng: 6.883333333 },
    label: 'Veendam',
    description: null
  },
  {
    uri: 'http://www.wikidata.org/entity/Q73065',
    coordinates: { lat: 53.1, lng: 6.883333333 },
    label: 'Veendam',
    description: null
  },
  {
    uri: 'http://www.wikidata.org/entity/Q73065',
    coordinates: { lat: 53.1, lng: 6.883333333 },
    label: 'Veendam',
    description: null
  },
  {
    uri: 'http://www.wikidata.org/entity/Q73065',
    coordinates: { lat: 53.1, lng: 6.883333333 },
    label: 'Veendam',
    description: null
  },
  {
    uri: 'http://www.wikidata.org/entity/Q73065',
    coordinates: { lat: 53.1, lng: 6.883333333 },
    label: 'Veendam',
    description: null
  },
  {
    uri: 'http://www.wikidata.org/entity/Q73065',
    coordinates: { lat: 53.1, lng: 6.883333333 },
    label: 'Veendam',
    description: null
  },
  {
    uri: 'http://www.wikidata.org/entity/Q73065',
    coordinates: { lat: 53.1, lng: 6.883333333 },
    label: 'Veendam',
    description: null
  },
  {
    uri: 'http://www.wikidata.org/entity/Q73065',
    coordinates: { lat: 53.1, lng: 6.883333333 },
    label: 'Veendam',
    description: null
  },
  {
    uri: 'http://www.wikidata.org/entity/Q73065',
    coordinates: { lat: 53.1, lng: 6.883333333 },
    label: 'Veendam',
    description: null
  },
  {
    uri: 'http://www.wikidata.org/entity/Q73065',
    coordinates: { lat: 53.1, lng: 6.883333333 },
    label: 'Veendam',
    description: null
  },
  {
    uri: 'http://www.wikidata.org/entity/Q73065',
    coordinates: { lat: 53.1, lng: 6.883333333 },
    label: 'Veendam',
    description: null
  },
  {
    uri: 'http://www.wikidata.org/entity/Q73065',
    coordinates: { lat: 53.1, lng: 6.883333333 },
    label: 'Veendam',
    description: null
  },
  {
    uri: 'http://www.wikidata.org/entity/Q73065',
    coordinates: { lat: 53.1, lng: 6.883333333 },
    label: 'Veendam',
    description: null
  },
  {
    uri: 'http://www.wikidata.org/entity/Q73065',
    coordinates: { lat: 53.1, lng: 6.883333333 },
    label: 'Veendam',
    description: null
  },
  {
    uri: 'http://www.wikidata.org/entity/Q73065',
    coordinates: { lat: 53.1, lng: 6.883333333 },
    label: 'Veendam',
    description: null
  },
  {
    uri: 'http://www.wikidata.org/entity/Q73065',
    coordinates: { lat: 53.1, lng: 6.883333333 },
    label: 'Veendam',
    description: null
  },
  {
    uri: 'http://www.wikidata.org/entity/Q73065',
    coordinates: { lat: 53.1, lng: 6.883333333 },
    label: 'Veendam',
    description: null
  },
  {
    uri: 'http://www.wikidata.org/entity/Q73065',
    coordinates: { lat: 53.1, lng: 6.883333333 },
    label: 'Veendam',
    description: null
  },
  {
    uri: 'http://www.wikidata.org/entity/Q73065',
    coordinates: { lat: 53.1, lng: 6.883333333 },
    label: 'Veendam',
    description: null
  },
  {
    uri: 'http://www.wikidata.org/entity/Q73065',
    coordinates: { lat: 53.1, lng: 6.883333333 },
    label: 'Veendam',
    description: null
  },
  {
    uri: 'http://www.wikidata.org/entity/Q73065',
    coordinates: { lat: 53.1, lng: 6.883333333 },
    label: 'Veendam',
    description: null
  },
  {
    uri: 'http://www.wikidata.org/entity/Q73065',
    coordinates: { lat: 53.1, lng: 6.883333333 },
    label: 'Veendam',
    description: null
  },
  {
    uri: 'http://www.wikidata.org/entity/Q73065',
    coordinates: { lat: 53.1, lng: 6.883333333 },
    label: 'Veendam',
    description: null
  },
  {
    uri: 'http://www.wikidata.org/entity/Q73065',
    coordinates: { lat: 53.1, lng: 6.883333333 },
    label: 'Veendam',
    description: null
  },
  {
    uri: 'http://www.wikidata.org/entity/Q73065',
    coordinates: { lat: 53.1, lng: 6.883333333 },
    label: 'Veendam',
    description: null
  },
  {
    uri: 'http://www.wikidata.org/entity/Q73065',
    coordinates: { lat: 53.1, lng: 6.883333333 },
    label: 'Veendam',
    description: null
  },
  {
    uri: 'http://www.wikidata.org/entity/Q73065',
    coordinates: { lat: 53.1, lng: 6.883333333 },
    label: 'Veendam',
    description: null
  },
  {
    uri: 'http://www.wikidata.org/entity/Q73065',
    coordinates: { lat: 53.1, lng: 6.883333333 },
    label: 'Veendam',
    description: null
  },
  {
    uri: 'http://www.wikidata.org/entity/Q73065',
    coordinates: { lat: 53.1, lng: 6.883333333 },
    label: 'Veendam',
    description: null
  },
  {
    uri: 'http://www.wikidata.org/entity/Q73065',
    coordinates: { lat: 53.1, lng: 6.883333333 },
    label: 'Veendam',
    description: null
  },
  {
    uri: 'http://www.wikidata.org/entity/Q73065',
    coordinates: { lat: 53.1, lng: 6.883333333 },
    label: 'Вендам',
    description: null
  },
  {
    uri: 'http://www.wikidata.org/entity/Q73065',
    coordinates: { lat: 53.1, lng: 6.883333333 },
    label: 'Вендам',
    description: null
  },
  {
    uri: 'http://www.wikidata.org/entity/Q73065',
    coordinates: { lat: 53.1, lng: 6.883333333 },
    label: 'Վեյնդամ',
    description: null
  },
  {
    uri: 'http://www.wikidata.org/entity/Q73065',
    coordinates: { lat: 53.1, lng: 6.883333333 },
    label: 'ונדם',
    description: null
  },
  {
    uri: 'http://www.wikidata.org/entity/Q73065',
    coordinates: { lat: 53.1, lng: 6.883333333 },
    label: 'فيندام',
    description: null
  },
  {
    uri: 'http://www.wikidata.org/entity/Q73065',
    coordinates: { lat: 53.1, lng: 6.883333333 },
    label: 'ویندم',
    description: null
  },
  {
    uri: 'http://www.wikidata.org/entity/Q73065',
    coordinates: { lat: 53.1, lng: 6.883333333 },
    label: 'フェーンダム',
    description: null
  },
  {
    uri: 'http://www.wikidata.org/entity/Q73065',
    coordinates: { lat: 53.1, lng: 6.883333333 },
    label: '芬丹',
    description: null
  },
  {
    uri: 'http://www.wikidata.org/entity/Q73065',
    coordinates: { lat: 53.1, lng: 6.883333333 },
    label: '페인담',
    description: null
  },
  {
    uri: 'http://www.wikidata.org/entity/Q835125',
    coordinates: { lat: 52.85, lng: 6.5 },
    label: 'Gemeente Midden-Drenthe',
    description: null
  },
  {
    uri: 'http://www.wikidata.org/entity/Q835125',
    coordinates: { lat: 52.85, lng: 6.5 },
    label: 'Midden-Drenthe',
    description: null
  },
  {
    uri: 'http://www.wikidata.org/entity/Q835125',
    coordinates: { lat: 52.85, lng: 6.5 },
    label: 'Midden-Drenthe',
    description: null
  },
  {
    uri: 'http://www.wikidata.org/entity/Q835125',
    coordinates: { lat: 52.85, lng: 6.5 },
    label: 'Midden-Drenthe',
    description: null
  },
  {
    uri: 'http://www.wikidata.org/entity/Q835125',
    coordinates: { lat: 52.85, lng: 6.5 },
    label: 'Midden-Drenthe',
    description: null
  },
  {
    uri: 'http://www.wikidata.org/entity/Q835125',
    coordinates: { lat: 52.85, lng: 6.5 },
    label: 'Midden-Drenthe',
    description: null
  },
  {
    uri: 'http://www.wikidata.org/entity/Q835125',
    coordinates: { lat: 52.85, lng: 6.5 },
    label: 'Midden-Drenthe',
    description: null
  },
  {
    uri: 'http://www.wikidata.org/entity/Q835125',
    coordinates: { lat: 52.85, lng: 6.5 },
    label: 'Midden-Drenthe',
    description: null
  },
  {
    uri: 'http://www.wikidata.org/entity/Q835125',
    coordinates: { lat: 52.85, lng: 6.5 },
    label: 'Midden-Drenthe',
    description: null
  },
  {
    uri: 'http://www.wikidata.org/entity/Q835125',
    coordinates: { lat: 52.85, lng: 6.5 },
    label: 'Midden-Drenthe',
    description: null
  },
  {
    uri: 'http://www.wikidata.org/entity/Q835125',
    coordinates: { lat: 52.85, lng: 6.5 },
    label: 'Midden-Drenthe',
    description: null
  },
  {
    uri: 'http://www.wikidata.org/entity/Q835125',
    coordinates: { lat: 52.85, lng: 6.5 },
    label: 'Midden-Drenthe',
    description: null
  },
  {
    uri: 'http://www.wikidata.org/entity/Q835125',
    coordinates: { lat: 52.85, lng: 6.5 },
    label: 'Midden-Drenthe',
    description: null
  },
  {
    uri: 'http://www.wikidata.org/entity/Q835125',
    coordinates: { lat: 52.85, lng: 6.5 },
    label: 'Midden-Drenthe',
    description: null
  },
  {
    uri: 'http://www.wikidata.org/entity/Q835125',
    coordinates: { lat: 52.85, lng: 6.5 },
    label: 'Midden-Drenthe',
    description: null
  },
  {
    uri: 'http://www.wikidata.org/entity/Q835125',
    coordinates: { lat: 52.85, lng: 6.5 },
    label: 'Midden-Drenthe',
    description: null
  },
  {
    uri: 'http://www.wikidata.org/entity/Q835125',
    coordinates: { lat: 52.85, lng: 6.5 },
    label: 'Midden-Drenthe',
    description: null
  },
  {
    uri: 'http://www.wikidata.org/entity/Q835125',
    coordinates: { lat: 52.85, lng: 6.5 },
    label: 'Midden-Drenthe',
    description: null
  },
  {
    uri: 'http://www.wikidata.org/entity/Q835125',
    coordinates: { lat: 52.85, lng: 6.5 },
    label: 'Midden-Drenthe',
    description: null
  },
  {
    uri: 'http://www.wikidata.org/entity/Q835125',
    coordinates: { lat: 52.85, lng: 6.5 },
    label: 'Midden-Drenthe',
    description: null
  },
  {
    uri: 'http://www.wikidata.org/entity/Q835125',
    coordinates: { lat: 52.85, lng: 6.5 },
    label: 'Midden-Drenthe',
    description: null
  },
  {
    uri: 'http://www.wikidata.org/entity/Q835125',
    coordinates: { lat: 52.85, lng: 6.5 },
    label: 'Midden-Drenthe',
    description: null
  },
  {
    uri: 'http://www.wikidata.org/entity/Q835125',
    coordinates: { lat: 52.85, lng: 6.5 },
    label: 'Midden-Drenthe',
    description: null
  },
  {
    uri: 'http://www.wikidata.org/entity/Q835125',
    coordinates: { lat: 52.85, lng: 6.5 },
    label: 'Midden-Drenthe',
    description: null
  },
  {
    uri: 'http://www.wikidata.org/entity/Q835125',
    coordinates: { lat: 52.85, lng: 6.5 },
    label: 'Midden-Drenthe',
    description: null
  },
  {
    uri: 'http://www.wikidata.org/entity/Q835125',
    coordinates: { lat: 52.85, lng: 6.5 },
    label: 'Midden-Drenthe',
    description: null
  },
  {
    uri: 'http://www.wikidata.org/entity/Q835125',
    coordinates: { lat: 52.85, lng: 6.5 },
    label: 'Midden-Drenthe',
    description: null
  },
  {
    uri: 'http://www.wikidata.org/entity/Q835125',
    coordinates: { lat: 52.85, lng: 6.5 },
    label: 'Midden-Drenthe',
    description: null
  },
  {
    uri: 'http://www.wikidata.org/entity/Q835125',
    coordinates: { lat: 52.85, lng: 6.5 },
    label: 'Midden-Drenthe',
    description: null
  },
  {
    uri: 'http://www.wikidata.org/entity/Q835125',
    coordinates: { lat: 52.85, lng: 6.5 },
    label: 'Midden-Drenthe',
    description: null
  },
  {
    uri: 'http://www.wikidata.org/entity/Q835125',
    coordinates: { lat: 52.85, lng: 6.5 },
    label: 'Midden-Drinte',
    description: null
  },
  {
    uri: 'http://www.wikidata.org/entity/Q835125',
    coordinates: { lat: 52.85, lng: 6.5 },
    label: 'Мидден-Дренте',
    description: null
  },
  {
    uri: 'http://www.wikidata.org/entity/Q835125',
    coordinates: { lat: 52.85, lng: 6.5 },
    label: 'Միդեն-Դրենթե',
    description: null
  },
  {
    uri: 'http://www.wikidata.org/entity/Q835125',
    coordinates: { lat: 52.85, lng: 6.5 },
    label: 'ميدن-درنته',
    description: null
  },
  {
    uri: 'http://www.wikidata.org/entity/Q835125',
    coordinates: { lat: 52.85, lng: 6.5 },
    label: 'میدن-درنته',
    description: null
  },
  {
    uri: 'http://www.wikidata.org/entity/Q835125',
    coordinates: { lat: 52.85, lng: 6.5 },
    label: '中德倫特',
    description: null
  }
];

class GoogleMapsVisualizer extends PureComponent<Props, State> {
  constructor() {
    super();
    this.state = {
      markers: [],
      zoomToMarkers: null
    };
  }

  async componentDidMount() {
    // const response = await VisualizersService.getMarkers({
    //   resultGraphIri: this.props.selectedResultGraphIri
    // });
    // const jsonData = await response.json();
    const { handleSetCurrentApplicationData, markers } = this.props;
    const { zoomToMarkers } = this.state;
    let markersToUse = markersDummy;
    let updateRedux = true;
    if (markers.length > 0) {
      markersToUse = markers;
      updateRedux = false;
    }
    this.setState({
      markers: markersToUse,
      zoomToMarkers: map => {
        const bounds = new window.google.maps.LatLngBounds();
        if (map !== null) {
          const childrenArray = map.props.children.props.children;
          if (childrenArray.length > 0) {
            map.props.children.props.children.forEach(child => {
              if (child.type === Marker) {
                bounds.extend(
                  new window.google.maps.LatLng(
                    child.props.position.lat,
                    child.props.position.lng
                  )
                );
              }
            });
            map.fitBounds(bounds);

            if (updateRedux) {
              handleSetCurrentApplicationData({ markers: markersToUse });
            }
          }
        }
      }
    });
  }

  render() {
    const { markers, zoomToMarkers } = this.state;
    return (
      <GoogleMap
        ref={zoomToMarkers}
        defaultZoom={8}
        defaultCenter={{ lat: 50.08804, lng: 14.42076 }}
      >
        <MarkerClusterer averageCenter enableRetinaIcons gridSize={60}>
          {markers &&
            markers.length > 0 &&
            markers.map(marker => (
              <Marker
                key={uuid()}
                position={marker.coordinates}
                onClick={() => Log.info('Clicked marker')}
                defaultAnimation={null}
              />
            ))}
        </MarkerClusterer>
      </GoogleMap>
    );
  }
}

type GoogleMapsVisualizerProps = {
  googleMapURL?: string,
  loadingElement: Object,
  containerElement: Object,
  mapElement: Object
};

const enhance: HOC<*, GoogleMapsVisualizerProps> = compose(
  withProps({
    googleMapURL:
      'https://maps.googleapis.com/maps/api/js?key=AIzaSyA5rWPSxDEp4ktlEK9IeXECQBtNUvoxybQ&libraries=places',
    loadingElement: <div style={{ height: `100%` }} />,
    containerElement: <div style={{ height: `100%` }} />,
    mapElement: <div style={{ height: `100%` }} />
  }),
  withScriptjs,
  withGoogleMap
);

export default enhance(GoogleMapsVisualizer);
