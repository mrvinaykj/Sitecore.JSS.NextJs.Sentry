// eslint-disable-next-line no-unused-vars
import { CommonFieldTypes, SitecoreIcon, Manifest } from '@sitecore-jss/sitecore-jss-dev-tools';

/**
 * Adds the SampleComponent component to the disconnected manifest.
 * This function is invoked by convention (*.sitecore.ts) when 'jss manifest' is run.
 * @param {Manifest} manifest Manifest instance to add components to
 */
export default function SampleComponent(manifest: Manifest): void {
  manifest.addComponent({
    name: 'Sample-Component',
    icon: SitecoreIcon.DocumentTag,
    fields: [
      { name: 'title', type: CommonFieldTypes.SingleLineText },
      { name: 'description', type: CommonFieldTypes.RichText },
    ],
    // Below is the placeholder added to the component
    placeholders: ["jss-sample-placeholder"]
    /*
    If the component implementation uses <Placeholder> or withPlaceholder to expose a placeholder,
    register it here, or components added to that placeholder will not be returned by Sitecore:
    placeholders: ['exposed-placeholder-name']
    */
  });
}
