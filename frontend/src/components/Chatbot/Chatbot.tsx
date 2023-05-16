import { FC } from 'react'
import {
  WebChatContainer,
  setEnableDebug,
} from '@ibm-watson/assistant-web-chat-react'

const webChatOptions = {
  integrationID: 'f1e437ad-bfc2-43ce-9ce4-ad85ab9f65a3',
  region: 'eu-gb',
  serviceInstanceID: 'd9047785-852e-4dcd-aca3-c7650ee336e2',
  // subscriptionID: 'only on enterprise plans',
  // Note that there is no onLoad property here. The WebChatContainer component will override it.
  // Use the onBeforeRender or onAfterRender prop instead.
}

// Include this if you want to get debugging information.
setEnableDebug(true)

const Chatbot: FC = () => {
  return (
    <>
      {/*@ts-ignore*/}
      <WebChatContainer config={webChatOptions} />
    </>
  )
}

export default Chatbot
