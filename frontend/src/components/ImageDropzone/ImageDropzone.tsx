import { FC, useState, useCallback, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { InfinitySpin } from 'react-loader-spinner'
import { useDropzone } from 'react-dropzone'
import styled from 'styled-components'

interface IProps {
  value: any
  setImage: any
}

const Dropzone = styled.div`
  border: 1px dashed #38b6ff;
  border-radius: 5px;
  color: #38b6ff;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 142px;
  cursor: pointer;
  img {
    height: 140px;
  }
`

const ImageDropzone: FC<IProps> = ({ value, setImage }) => {
  const { eventInformation } = useSelector((store: any) => store.events)

  const [loading, setLoading] = useState<boolean>(false)
  const [imagePreview, setImagePreview] = useState<string>('')

  useEffect(() => {
    if (eventInformation.photoURL) {
      setImagePreview(URL.createObjectURL(eventInformation.photoURL))
    }
  }, [eventInformation])

  const onDrop = useCallback((acceptedFiles: any) => {
    setLoading(true)
    // Set image to the file
    setImage(acceptedFiles[0])
    // Set image preview to the preview
    const objectUrl = URL.createObjectURL(acceptedFiles[0])
    setImagePreview(objectUrl)

    setLoading(false)
  }, [])

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    multiple: false,
    // @ts-ignore
    accept: 'image/*',
  })

  return (
    <Dropzone {...getRootProps()}>
      <input {...getInputProps()} />
      {imagePreview ? (
        <img
          src={imagePreview}
          alt="event preview"
          className="w-[850px] object-cover"
        />
      ) : loading ? (
        <InfinitySpin width="200" color="#38b6ff" />
      ) : (
        <span>Drag & drop file here, or click to select file</span>
      )}
    </Dropzone>
  )
}

export default ImageDropzone
