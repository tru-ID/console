import { Box, Code, Flex, Text } from '@chakra-ui/layout'
import { Spinner } from '@chakra-ui/spinner'
import { useSession } from 'next-auth/client'
import { useRouter } from 'next/router'
import * as React from 'react'

const withAuthenticationRequired = <P extends object>(
  Component: React.ComponentType,
) =>
  function WithAuthenticationRequired(props: P): JSX.Element {
    const [session, loading] = useSession()
    const router = useRouter()

    React.useEffect(() => {
      if (!session && !loading) {
        router.replace('/login')
      }
    }, [session, loading, router])

    if (session && session.error === 'NewAccessTokenError') {
      return (
        <Box p={4}>
          <Text>
            Error obtaining a new <Code>access_token</Code>, check your{' '}
            <Code>client_id</Code> and <Code>client_secret</Code> credentials
          </Text>
        </Box>
      )
    }

    if (session) {
      return <Component {...props} />
    }

    return (
      <Flex height="100vh" align="center" justify="center">
        <Spinner height="80px" width="80px" borderRadius="100%" />
      </Flex>
    )
  }

export default withAuthenticationRequired
