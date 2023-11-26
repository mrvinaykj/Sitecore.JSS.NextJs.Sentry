import { GetServerSidePropsContext, GetStaticPropsContext } from 'next';
import { DictionaryService, LayoutService } from '@sitecore-jss/sitecore-jss-nextjs';
import { dictionaryServiceFactory } from 'lib/dictionary-service-factory';
import { layoutServiceFactory } from 'lib/layout-service-factory';
import { SitecorePageProps } from 'lib/page-props';
import config from 'temp/config';
import { Plugin, isServerSidePropsContext } from '..';
import { extractPath } from '../extract-path';
import * as Sentry from '@sentry/nextjs';

class NormalModePlugin implements Plugin {
  private dictionaryService: DictionaryService;
  private layoutService: LayoutService;

  order = 0;

  constructor() {
    this.dictionaryService = dictionaryServiceFactory.create();
    this.layoutService = layoutServiceFactory.create();
  }

  async exec(props: SitecorePageProps, context: GetServerSidePropsContext | GetStaticPropsContext) {
    if (context.preview) return props;

    /**
     * Normal mode
     */
    // Get normalized Sitecore item path
    try {
      const path = extractPath(context.params);
      const sitecoreContext = props?.layoutData?.sitecore?.context;
      Sentry.addBreadcrumb({
        category: 'site_name',
        message: sitecoreContext?.site?.name,
      });
      Sentry.configureScope((scope) => {
        scope.setTag('page_mode', 'normal');
        scope.setTag('database', props?.layoutData?.sitecore?.route?.databaseName);
        scope.setTag('site', sitecoreContext?.site?.name);
        scope.setTag('language', sitecoreContext?.language);
        scope.setExtra('item_path', path);
        scope.setExtra('item_id', props?.layoutData?.sitecore?.route?.itemId);
      });
      // Use context locale if Next.js i18n is configured, otherwise use default language
      props.locale = context.locale ?? config.defaultLanguage;

      // Fetch layout data, passing on req/res for SSR
      props.layoutData = await this.layoutService.fetchLayoutData(
        path,
        props.locale,
        // eslint-disable-next-line prettier/prettier
        isServerSidePropsContext(context) ? (context as GetServerSidePropsContext).req : undefined,
        isServerSidePropsContext(context) ? (context as GetServerSidePropsContext).res : undefined
      );

      if (!props.layoutData.sitecore.route) {
        // A missing route value signifies an invalid path, so set notFound.
        // Our page routes will return this in getStatic/ServerSideProps,
        // which will trigger our custom 404 page with proper 404 status code.
        // You could perform additional logging here to track these if desired.
        props.notFound = true;
      }

      // Fetch dictionary data
      props.dictionary = await this.dictionaryService.fetchDictionaryData(props.locale);

      return props;
    } catch (err) {
      Sentry.configureScope((scope) => {
        scope.setTag('page_mode', 'normal');
        scope.setTag('database', props?.layoutData?.sitecore?.route?.databaseName);
        scope.setTag('site', props?.layoutData?.sitecore?.context?.site?.name);
        scope.setTag('language', props?.layoutData?.sitecore?.context?.language);
        scope.setExtra('item_path', extractPath(context?.params));
        scope.setExtra('item_id', props?.layoutData?.sitecore?.route?.itemId);
      });
      Sentry.captureException(err);
      return props;
    }
  }
}

export const normalModePlugin = new NormalModePlugin();
