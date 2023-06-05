import { Placeholder } from '@sitecore-jss/sitecore-jss-nextjs';
import { ComponentProps } from 'lib/component-props';

const CardsPlaceholderComponent = (props: ComponentProps): JSX.Element => (
  <Placeholder name="ph-cards-list" rendering={props.rendering} />
);

export default CardsPlaceholderComponent;
