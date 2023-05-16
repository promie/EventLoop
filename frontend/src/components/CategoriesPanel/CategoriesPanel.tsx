import { FC } from 'react'
import { Link } from 'react-router-dom'
import {
  MdOutlineBusinessCenter,
  MdOutlineFestival,
  MdOutlineSportsBasketball,
} from 'react-icons/md'
import { TbBuildingChurch, TbFriends } from 'react-icons/tb'
import { GiVideoConference } from 'react-icons/gi'
import { RiVidiconLine } from 'react-icons/ri'
import { SiFandom } from 'react-icons/si'
import { IoFastFoodOutline, IoCodeSlash } from 'react-icons/io5'

const CategoriesPanel: FC = () => {
  return (
    <div className="mb-[40px]">
      <h1 className={'text-[24px] text-bold mb-2 font-bold'}>
        Events by Categories
      </h1>

      <div className="flex items-center justify-center">
        <Link
          to={'/events?category=Corporate'}
          className="bg-gray-100 w-[300px] font-bold flex items-center justify-evenly text-[15px] py-[15px] cursor-pointer rounded-sm border"
        >
          <div className="ml-[25px] w-[50px]">
            <MdOutlineBusinessCenter color={'#EBD148'} size={30} />
          </div>
          <span className="flex-1">Corporate</span>
        </Link>
        <Link
          to={'/events?category=Fundraising'}
          className="bg-gray-100 w-[300px] font-bold flex items-center justify-evenly text-[15px] py-[15px] cursor-pointer rounded-sm border"
        >
          <div className="ml-[25px] w-[50px]">
            <TbBuildingChurch color={'#EBD148'} size={30} />
          </div>
          <span className="flex-1">Fundraising</span>
        </Link>
        <Link
          to={'/events?category=Conferences%20and%20Workshops'}
          className="bg-gray-100 w-[300px] font-bold flex items-center justify-evenly text-[15px] py-[15px] cursor-pointer rounded-sm border"
        >
          <div className="ml-[25px] w-[50px]">
            <GiVideoConference color={'#EBD148'} size={30} />
          </div>
          <span className="flex-1 text-sm">Conferences & Workshops</span>
        </Link>
        <Link
          to={'/events?category=Virtual'}
          className="bg-gray-100 w-[300px] font-bold flex items-center justify-evenly text-[15px] py-[15px] cursor-pointer rounded-sm border"
        >
          <div className="ml-[25px] w-[50px]">
            <RiVidiconLine color={'#EBD148'} size={30} />
          </div>
          <span className="flex-1">Virtual</span>
        </Link>
        <Link
          to={'/events?category=Fandom'}
          className="bg-gray-100 w-[300px] font-bold flex items-center justify-evenly text-[15px] py-[15px] cursor-pointer rounded-sm border"
        >
          <div className="ml-[25px] w-[50px]">
            <SiFandom color={'#EBD148'} size={30} />
          </div>
          <span className="flex-1">Fandom</span>
        </Link>
      </div>

      <div className="flex items-center justify-center">
        <Link
          to={'/events?category=Festivals%20and%20Fairs'}
          className="bg-gray-100 w-[300px] font-bold flex items-center justify-evenly text-[15px] py-[15px] cursor-pointer rounded-sm border"
        >
          <div className="ml-[25px] w-[50px]">
            <MdOutlineFestival color={'#EBD148'} size={30} />
          </div>
          <span className="flex-1">Festivals & Fairs</span>
        </Link>
        <Link
          to={'/events?category=Food%20and%20Drink'}
          className="bg-gray-100 w-[300px] font-bold flex items-center justify-evenly text-[15px] py-[15px] cursor-pointer rounded-sm border"
        >
          <div className="ml-[25px] w-[50px]">
            <IoFastFoodOutline color={'#EBD148'} size={30} />
          </div>
          <span className="flex-1">Food & Drink</span>
        </Link>
        <Link
          to={'/events?category=Networking'}
          className="bg-gray-100 w-[300px] font-bold flex items-center justify-evenly text-[15px] py-[15px] cursor-pointer rounded-sm border"
        >
          <div className="ml-[25px] w-[50px]">
            <TbFriends color={'#EBD148'} size={30} />
          </div>
          <span className="flex-1">Networking</span>
        </Link>
        <Link
          to={'/events?category=Hackathons'}
          className="bg-gray-100 w-[300px] font-bold flex items-center justify-evenly text-[15px] py-[15px] cursor-pointer rounded-sm border"
        >
          <div className="ml-[25px] w-[50px]">
            <IoCodeSlash color={'#EBD148'} size={30} />
          </div>
          <span className="flex-1">Hackathons</span>
        </Link>
        <Link
          to={'/events?category=Sports%20and%20Tournaments'}
          className="bg-gray-100 w-[300px] font-bold flex items-center justify-evenly text-[15px] py-[15px] cursor-pointer rounded-sm border"
        >
          <div className="ml-[25px] w-[50px]">
            <MdOutlineSportsBasketball color={'#EBD148'} size={30} />
          </div>
          <span className="flex-1 w-[80px] text-sm">Sports & Tournaments</span>
        </Link>
      </div>
    </div>
  )
}

export default CategoriesPanel
