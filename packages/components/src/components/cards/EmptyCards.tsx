import React from 'react'
import { Animated, Text, View, ViewStyle } from 'react-native'

import { LoadState } from '@devhub/core/src/types'
import { useAnimatedTheme } from '../../hooks/use-animated-theme'
import { contentPadding } from '../../styles/variables'
import { AnimatedActivityIndicator } from '../animated/AnimatedActivityIndicator'
import { AnimatedTransparentTextOverlay } from '../animated/AnimatedTransparentTextOverlay'
import { Button } from '../common/Button'

const clearMessages = [
  'All clear!',
  'Awesome!',
  'Good job!',
  "You're doing great!",
  'You rock!',
]

const emojis = ['👍', '👏', '💪', '🎉', '💯']

const getRandomClearMessage = () => {
  const randomIndex = Math.floor(Math.random() * clearMessages.length)
  return clearMessages[randomIndex]
}

const getRandomEmoji = () => {
  const randomIndex = Math.floor(Math.random() * emojis.length)
  return emojis[randomIndex]
}

// only one message per app running instance
// because a chaning message is a bit distractive
const clearMessage = getRandomClearMessage()
const emoji = getRandomEmoji()

export interface EmptyCardsProps {
  errorMessage?: string
  fetchNextPage: ((params?: { perPage?: number }) => void) | undefined
  loadState: LoadState
  refresh: (() => void | Promise<void>) | undefined
}

export function EmptyCards(props: EmptyCardsProps) {
  const theme = useAnimatedTheme()

  const { errorMessage, fetchNextPage, loadState, refresh } = props

  const hasError = errorMessage || loadState === 'error'

  const renderContent = () => {
    if (loadState === 'loading_first') {
      return <AnimatedActivityIndicator color={theme.foregroundColor as any} />
    }

    const containerStyle: ViewStyle = { width: '100%', padding: contentPadding }
    const textStyle = {
      lineHeight: 20,
      fontSize: 14,
      color: theme.foregroundColorMuted50,
      textAlign: 'center',
    }

    if (hasError) {
      return (
        <View style={containerStyle}>
          <Animated.Text style={textStyle}>
            {`⚠️\nSomething went wrong`}
            {!!errorMessage && (
              <Text style={{ fontSize: 13 }}>{`\nError: ${errorMessage}`}</Text>
            )}
          </Animated.Text>

          {!!refresh && (
            <View style={{ padding: contentPadding }}>
              <Button
                analyticsLabel="try_again"
                children="Try again"
                disabled={loadState !== 'error'}
                loading={loadState === 'loading'}
                onPress={() => refresh()}
              />
            </View>
          )}
        </View>
      )
    }

    return (
      <View style={containerStyle}>
        <Animated.Text style={textStyle}>
          {clearMessage} {emoji}
        </Animated.Text>
      </View>
    )
  }

  const headerOrFooterHeight = 40 + 2 * contentPadding

  return (
    <AnimatedTransparentTextOverlay
      color={theme.backgroundColor as any}
      size={contentPadding}
      from="vertical"
    >
      <View style={{ flex: 1 }}>
        <View style={{ height: headerOrFooterHeight }} />

        <View
          style={{
            flex: 1,
            alignContent: 'center',
            alignItems: 'center',
            justifyContent: 'center',
            padding: contentPadding,
          }}
        >
          {renderContent()}
        </View>

        <View style={{ minHeight: headerOrFooterHeight }}>
          {!!fetchNextPage && !hasError && loadState !== 'loading_first' && (
            <View style={{ padding: contentPadding }}>
              <Button
                analyticsLabel="load_more"
                children="Load more"
                disabled={loadState !== 'loaded'}
                loading={loadState === 'loading_more'}
                onPress={() => fetchNextPage()}
              />
            </View>
          )}
        </View>
      </View>
    </AnimatedTransparentTextOverlay>
  )
}
