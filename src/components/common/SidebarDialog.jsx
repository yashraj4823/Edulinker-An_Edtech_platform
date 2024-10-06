import { Dialog, Transition } from '@headlessui/react';
//import { X } from '@heroicons/react/24/outline';
import { Fragment, useEffect, useState } from 'react';
import { ImCross } from "react-icons/im";
import { IoIosArrowDropdownCircle, IoIosArrowDropupCircle } from 'react-icons/io';
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
    const [isCatalogOpen, setIsCatalogOpen] = useState(false);

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
                                        onClick={() => setIsCatalogOpen(!isCatalogOpen)}
                                    >
                                        <p>{link.title}</p>
                                        {
                                          isCatalogOpen ? <IoIosArrowDropupCircle /> : <IoIosArrowDropdownCircle/>
                                        }
                                    </div>      
                                        {isCatalogOpen && (
                                          <ul className="ml-4 mt-4 flex flex-col gap-4">
                                            {loading ? (
                                              <li className="text-center">Loading...</li>
                                            ) : subLinks.length ? (
                                              subLinks.map((subLink, i) => (
                                                <li key={i}>
                                                  <Link
                                                    to={`/catalog/${subLink.name.split(" ").join("-").toLowerCase()}`}
                                                    onClick={() => setOpen(false)} // Close dialog on click
                                                    className={`rounded-lg bg-transparent py-2 pl-4 hover:bg-richblack-50 ${matchRoute(`/catalog/${subLink.name}`) ? "text-yellow-25" : "text-richblack-25"}`}
                                                  >
                                                    {subLink.name}
                                                  </Link>
                                                </li>
                                              ))
                                            ) : (
                                              <li className="text-center">No Courses Found</li>
                                            )}
                                          </ul>
                                        )}

                                        

                                        

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
