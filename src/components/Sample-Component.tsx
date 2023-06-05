import { Text, Field, withDatasourceCheck, RichText, Placeholder } from '@sitecore-jss/sitecore-jss-nextjs';
import { ComponentProps } from 'lib/component-props';

type SampleComponentProps = ComponentProps & {
  fields: {
    title: Field<string>;
    description: Field<string>;
  };
};

const SampleComponent = (props: SampleComponentProps): JSX.Element => (
  <div>
    <Text field={props.fields.title} />
    <RichText field={props.fields.description} />
    <Placeholder name="jss-sample-placeholder" rendering={props.rendering} />
  </div>
);

export default withDatasourceCheck()<SampleComponentProps>(SampleComponent);
