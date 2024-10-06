import { Dialog, Transition } from '@headlessui/react';
//import { X } from '@heroicons/react/24/outline';
import { Fragment, useEffect, useState } from 'react';
import { ImCross } from "react-icons/im";
import { IoIosArrowDropdownCircle } from "react-icons/io";
import { useSelector } from 'react-redux';
import { Link, matchPath, useLocation } from 'react-router-dom';
import logo from "../../assets/Logo/Logo-Full-Light.png";
import { NavbarLinks } from '../../data/navbar-links';
import { apiConnector } from '../../services/apiconnector';
import { categories } from '../../services/apis';

const SidebarDialog = ({open, setOpen, }) => {

    const {token} = useSelector((state) => state.auth);
    const [subLinks, setSubLinks] = useState([]);
    const [loading, setLoading] = useState(false)

    const location = useLocation();

    const fetchSublinks = async() => {
        setLoading(true)
        try{
            const result = await apiConnector("GET", categories.CATEGORIES_API);
            setSubLinks(result.data.data);
            console.log("Printing Sublinks result:", result);
            
        }
        catch(error){
            console.log("Could not fetch the category list");
        }
        setLoading(false)
    }

    
    useEffect(() => {
        fetchSublinks();
    },[]);


    const matchRoute = (route) => {
        return matchPath({path:route}, location.pathname);
    }
  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog as='div' className='relative z-10' onClose={setOpen}>
        <div className='fixed inset-0' />
        <div className='fixed inset-0 overflow-hidden'>
          <div className='absolute inset-0 overflow-hidden'>
            <div className=' pointer-events-none fixed inset-y-0 left-0 flex max-w-full pr-10'>
              <Transition.Child
                as={Fragment}
                enter='transform transition ease-in-out duration-500 sm:duration-700'
                enterFrom='-translate-x-full'
                enterTo='translate-x-0'
                leave='transform transition ease-in-out duration-500 sm:duration-700'
                leaveFrom='translate-x-0'
                leaveTo='-translate-x-full'
              >
                <Dialog.Panel className=' pointer-events-auto w-screen max-w-[16rem]'>
                  <div className='flex h-full flex-col overflow-hidden bg-richblack-700 py-6 shadow-xl rounded-r-xl'>
                    <div className='px-4 sm:px-6'>
                      <div className='flex items-start justify-between'>
                        <Dialog.Title className='text-base font-semibold leading-6 text-gray-900'>
                            <Link to="/">
                            <img src={logo} alt='logo' width={160} height={42} loading='lazy'/>
                            </Link>
                        </Dialog.Title>
                        <div className='ml-3 flex h-7 items-center'>
                          <button
                            type='button'
                            className='rounded-m text-gray-400 hover:text-gray-500 focus:outline-none'
                            onClick={() => setOpen(false)}
                          >
                            <span className='sr-only'>Close panel</span>
                            <ImCross className='text-white'/>
                          </button>
                        </div>
                      </div>
                    </div>
                    <div className='relative mt-6 flex-1 px-4 sm:px-6'>
                      {/* Content */}
                      <nav className=" mt-4">
                        <ul className='flex flex-1 flex-col gap-y-7 text-richblack-25'>
                        {
                            NavbarLinks.map((link, index) => (
                            <li key={index}>
                                {
                                link.title === "Catalog" ? (
                                    <>
                                    <div
                                        className={`group relative flex cursor-pointer items-center gap-1 ${
                                        matchRoute("/catalog/:catalogName")
                                            ? "text-yellow-25"
                                            : "text-richblack-25"
                                        }`}
                                    >
                                        <p>{link.title}</p>
                                        <IoIosArrowDropdownCircle />
                                        <div className="invisible absolute left-[50%] top-[50%] z-[1000] flex w-[200px] translate-x-[-50%] translate-y-[3em] flex-col rounded-lg bg-richblack-5 p-4 text-richblack-900 opacity-0 transition-all duration-150 group-hover:visible group-hover:translate-y-[1.65em] group-hover:opacity-100 lg:w-[300px]">
                                        <div className="absolute left-[50%] top-0 -z-10 h-6 w-6 translate-x-[80%] translate-y-[-40%] rotate-45 select-none rounded bg-richblack-5"></div>
                                        {loading ? (
                                            <p className="text-center">Loading...</p>
                                        ) : (subLinks && subLinks.length) ? (
                                            <>
                                            {subLinks.map((subLink, i) => (
                                                <Link
                                                    to={`/catalog/${subLink.name
                                                    .split(" ")
                                                    .join("-")
                                                    .toLowerCase()}`}
                                                    onClick={() => setOpen(false)}
                                                    className="rounded-lg bg-transparent py-4 pl-4 hover:bg-richblack-50"
                                                    key={i}
                                                >
                                                    <p>{subLink.name}</p>
                                                </Link>
                                                ))}
                                            </>
                                        ) : (
                                            <p className="text-center">No Courses Found</p>
                                        )}
                                        </div>
                                    </div>
                                    </>
                                ) : (
                                    <Link 
                                      to={link?.path}
                                      onClick={() => setOpen(false)}
                                    >
                                    <p
                                        className={`${
                                        matchRoute(link?.path)
                                            ? "text-yellow-25"
                                            : "text-richblack-25"
                                        }`}
                                    >
                                        {link.title}
                                    </p>
                                    </Link>
                                )}
                                </li>
                            )
                            ) 
                        }
                        </ul>
                      </nav>
                      
                    </div>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
};

export default SidebarDialog;
