import {
  Text,
  Field,
  withDatasourceCheck,
  LinkField,
  ImageField,
  Link,
  Image,
} from '@sitecore-jss/sitecore-jss-nextjs';
import { ComponentProps } from 'lib/component-props';

type CardProps = {
  id: string;
  fields: {    
    title: Field<string>;
    description: Field<string>;
    link: LinkField;
    image: ImageField;
  };
};
type CardListComponentProps = ComponentProps & {
  fields: {
    cardListHeading: Field<string>;
    items: CardProps[];
  };
};

const CardListComponent = ({ fields }: CardListComponentProps): JSX.Element => (
  <div className="container">
    <Text field={fields.cardListHeading} tag="h2" className='h2' />
    <div className="flex flex-row">{fields?.items?.map((card) => card && <Card {...card} />)}</div>
  </div>
);

const Card = ({ fields, id }: CardProps): JSX.Element => (
  <div className="basis-1/2" key={id}>
    <Text field={fields.title} tag="h3" className='h3'/>
    <Text field={fields.description} tag="p" />
    <Link field={fields.link} className="link-field">
      <Image field={fields.image} />
    </Link>
  </div>
);

export default withDatasourceCheck()<CardListComponentProps>(CardListComponent);
