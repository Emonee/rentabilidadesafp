import AlertIcon from '@/components/icons/AlertIcon'
import styles from './styles.module.css'

type Props = {
  message: string
}

export default function (props: Props) {
  return (
    <div class={styles.alert}>
      <p>{props.message}</p>
      <AlertIcon />
    </div>
  )
}
