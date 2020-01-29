import React from 'react'
import { Stack, navigation } from 'nr1'
import MetricStack from '../../components/metric/MetricStack'

const mandeContainer = props => {
  /** NAVIGATION CONFIGURATION ******************* */
  const getNavigation = target => {
    return navigation.getReplaceNerdletLocation(target)
  }

  const videoQosNerdlet = () => {
    return {
      id: 'video-qos-nerdlet',
      urlStateOptions: '',
    }
  }

  /** INITIALIZE METRIC DEFINITIONS ***************** */
  const metricConfigs = [
    {
      title: 'Users',
      navigateTo: '',
      metrics: [
        {
          title: '# of Viewers',
          query: '',
        },
        {
          title: 'Stream Joins',
          threshold: {
            critical: 10,
            warning: 50,
            type: 'below',
          },
          invertCompareTo: 'true',
          query: {
            nrql: `SELECT count(*)  as 'result' FROM PageAction, MobileVideo, RokuVideo  WHERE actionName IN ('CONTENT_START', 'CONTENT_NEXT')`,
            lookup: 'result',
          }
        },
        {
          title: 'Total View Time',
          query: '',
        },
      ],
    },
    {
      title: 'Platform/Client/App',
      navigateTo: '',
      metrics: [
        {
          title: 'Crash Rate',
          query: '',
        },
        {
          title: 'Javascript Error Rate',
          query: {
            nrql: `SELECT filter(count(*), WHERE eventType() = 'JavaScriptError') / filter(count(*), WHERE eventType() = 'PageView') * 100  as 'result' FROM JavaScriptError,PageView`,
            lookup: 'result',
          },
        },
        {
          title: 'App Launch Time',
          query: '',
        },
      ],
    },
    {
      title: 'APIs',
      navigateTo: '',
      metrics: [
        {
          title: '5xx Error Rate',
          query: {
            nrql: `SELECT percentage(count(*), where httpResponseCode like '5%') as 'result' FROM Transaction`,
            lookup: 'result',
          },
        },
        {
          title: 'Non 5xx Error Rate',
          query: {
            nrql: `SELECT percentage(count(*), where httpResponseCode like '4%') as 'result' FROM Transaction`,
            lookup: 'result',
          },
        },
        {
          title: 'Latency 90th Percentile',
          query: {
            nrql: `SELECT percentile(duration, 90) as 'percentile' FROM Transaction`,
            lookup: 'percentile',
          },
        },
      ],
    },
    {
      title: 'Video',
      navigateTo: getNavigation(videoQosNerdlet()),
      metrics: [
        {
          title: 'Player Ready',
          query: {
            nrql: `SELECT percentile(timeSinceLoad, 50) as 'percentile' FROM PageAction`,
            lookup: 'percentile',
          },
        },
        {
          title: 'Video Start Failure',
          query: {
            nrql: `SELECT count(*) AS 'result' FROM PageAction, MobileVideo, RokuVideo  WHERE actionName = 'CONTEN_ERROR' and contentPlayhead = 0`,
            lookup: 'result',
          },
        },
        {
          title: 'Exit Before Video Start',
          query: {
            nrql: `SELECT filter(count(*), WHERE actionName IN ('CONTENT_REQUEST', 'CONTENT_NEXT')) - filter(count(*), WHERE actionName = 'CONTENT_START') as 'result' FROM PageAction, MobileVideo, RokuVideo`,
            lookup: 'result',
          },
        },
        {
          title: 'Time to First Frame',
          query: {
            nrql: `SELECT percentile(timeSinceRequested/1000, 50) as 'percentile' FROM PageAction, MobileVideo, RokuVideo WHERE actionName = 'CONTENT_START'`,
            lookup: 'percentile',
          },
        },
        {
          title: 'Rebuffer Ratio',
          query: {
            nrql: `SELECT filter(sum(timeSinceBufferBegin), WHERE actionName = 'CONTENT_BUFFER_END' and isInitialBuffering = 0) / filter(sum(playtimeSinceLastEvent), WHERE contentPlayhead is not null) as 'result' FROM PageAction, MobileVideo, RokuVideo`,
            lookup: 'result',
          },
        },
        {
          title: 'Interruption Ratio',
          query: {
            nrql: `SELECT filter(count(*), where actionName = 'CONTENT_BUFFER_START') / filter(count(*), where actionName = 'CONTENT_START') AS 'result' FROM PageAction, MobileVideo, RokuVideo`,
            lookup: 'result',
          },
        },
      ],
    },
    {
      title: 'CDN',
      navigateTo: '',
    },
    {
      title: 'Origin/Packaging',
      navigateTo: '',
    },
    {
      title: 'Ingest/Encode',
      navigateTo: '',
    },
    {
      title: 'Content/Source',
      navigateTo: '',
    },
  ]

  // convert metricStacks into components
  const { accountId } = props
  const metricStacks = metricConfigs
    .map(config => {
      return [...Array(config)].map((_, idx) => {
        return (
          <MetricStack
            key={config.title + idx}
            config={config}
            accountId={accountId}
            duration={props.duration}
          />
        )
      })
    })
    .reduce((arr, val) => {
      return arr.concat(val)
    }, [])

  console.info('MandeContainer render')
  return (
    <Stack
      fullWidth={true}
      directionType={Stack.DIRECTION_TYPE.HORIZONTAL}
      horizontalType={Stack.HORIZONTAL_TYPE.FILL_EVENLY}
    >
      {metricStacks}
    </Stack>
  )
}

export default mandeContainer
