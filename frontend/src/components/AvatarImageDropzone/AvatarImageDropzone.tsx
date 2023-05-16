import { FC, useState, useCallback, useEffect } from 'react'
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

const AvatarImageDropzone: FC<IProps> = ({ value, setImage }) => {
  const [loading, setLoading] = useState<boolean>(false)
  const [imagePreview, setImagePreview] = useState<string>('')

  useEffect(() => {
    if (value) {
      typeof value === 'string'
        ? setImagePreview(value)
        : setImagePreview(URL.createObjectURL(value))
    }
  }, [value])

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
          className="rounded-full object-cover"
        />
      ) : loading ? (
        <InfinitySpin width="200" color="#38b6ff" />
      ) : (
        <div className="bg-gray-200 w-full h-full flex items-center justify-center mt-[-20px] rounded-full">
          <p className="text-[#000]">Upload Photo</p>
        </div>
      )}
    </Dropzone>
  )
}

export default AvatarImageDropzone
