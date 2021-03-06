import React from 'react'
import { Animated, View } from 'react-native'

import { trimNewLinesAndSpaces } from '@devhub/core/src/utils/helpers/shared'
import { useAnimatedTheme } from '../../../../hooks/use-animated-theme'
import { fixURL } from '../../../../utils/helpers/github/url'
import { AnimatedIcon } from '../../../animated/AnimatedIcon'
import { Link } from '../../../common/Link'
import { getCardStylesForTheme } from '../../styles'
import { getCardRowStylesForTheme } from './styles'

export interface WikiPageRowProps {
  isRead: boolean
  name?: string
  showMoreItemsIndicator?: boolean
  smallLeftColumn?: boolean
  title: string
  url: string
}

export interface WikiPageRowState {}

export const WikiPageRow = React.memo((props: WikiPageRowProps) => {
  const theme = useAnimatedTheme()

  const {
    isRead,
    name,
    showMoreItemsIndicator,
    smallLeftColumn,
    title: _title,
    url,
  } = props

  const title = trimNewLinesAndSpaces(_title || name)
  if (!title) return null

  return (
    <View style={getCardRowStylesForTheme(theme).container}>
      <View
        style={[
          getCardStylesForTheme(theme).leftColumn,
          smallLeftColumn
            ? getCardStylesForTheme(theme).leftColumn__small
            : getCardStylesForTheme(theme).leftColumn__big,
        ]}
      />

      <View style={getCardStylesForTheme(theme).rightColumn}>
        <Link
          href={showMoreItemsIndicator ? undefined : fixURL(url)}
          style={getCardRowStylesForTheme(theme).mainContentContainer}
        >
          <Animated.Text
            numberOfLines={1}
            style={[
              getCardStylesForTheme(theme).normalText,
              isRead && getCardStylesForTheme(theme).mutedText,
            ]}
          >
            <AnimatedIcon
              name="book"
              style={[
                getCardStylesForTheme(theme).normalText,
                isRead && getCardStylesForTheme(theme).mutedText,
              ]}
            />{' '}
            {showMoreItemsIndicator ? '' : title}
            {!!showMoreItemsIndicator && (
              <Animated.Text
                numberOfLines={1}
                style={[
                  getCardStylesForTheme(theme).normalText,
                  getCardStylesForTheme(theme).mutedText,
                ]}
              >
                ...
              </Animated.Text>
            )}
          </Animated.Text>
        </Link>
      </View>
    </View>
  )
})
