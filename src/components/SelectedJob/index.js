import {Component} from 'react'
import Cookies from 'js-cookie'
import {BsStarFill} from 'react-icons/bs'
import {FaShoppingBag} from 'react-icons/fa'
import {MdLocationOn} from 'react-icons/md'
import Skill from '../Skill'
import SimilarJobs from '../SimilarJobs'
import './index.css'

class SelectedJob extends Component {
  state = {
    jobDetails: {},
    lifeDetails: {},
    skillData: [],
    similarJobs: [],
    isApi: false,
  }

  componentDidMount() {
    this.callingApi()
  }

  formateJobsData = data => ({
    companyLogoUrl: data.company_logo_url,
    employmentType: data.employment_type,
    companyWebsiteUrl: data.company_website_url,
    id: data.id,
    jobDescription: data.job_description,
    location: data.location,
    packagePerAnnum: data.package_per_annum,
    rating: data.rating,
    title: data.title,
  })

  formateJobsData1 = data => ({
    companyLogoUrl: data.company_logo_url,
    employmentType: data.employment_type,
    jobDescription: data.job_description,
    location: data.location,
    packagePerAnnum: data.package_per_annum,
    rating: data.rating,
    title: data.title,
    id: data.id,
  })

  lifeAtCompanyFormat = data => ({
    description: data.description,
    imageUrl: data.image_url,
  })

  skillFormat = data => ({
    name: data.name,
    imageUrl1: data.image_url,
  })

  navigateToApi = () => {
    this.callingApi()
  }

  apiFalse = () => (
    <div className="apiFail" testid="loader">
      <img
        src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
        className="img20"
        alt="failure view"
      />
      <h1>Oops! Something Went Wrong</h1>
      <p>We cannot seem to find the page you are looking for</p>
      <button type="button" onClick={this.navigateToApi}>
        Retry
      </button>
    </div>
  )

  callingApi = async () => {
    const token1 = Cookies.get('jwt_token')
    const {match} = this.props
    const {params} = match
    const {id} = params
    const url = `https://apis.ccbp.in/jobs/${id}`
    const option = {
      headers: {
        Authorization: `Bearer ${token1}`,
      },
      method: 'GET',
    }
    const response = await fetch(url, option)
    if (response.ok) {
      const data = await response.json()
      const jobDetails = this.formateJobsData(data.job_details)
      const lifeDetails = this.lifeAtCompanyFormat(
        data.job_details.life_at_company,
      )
      const skillData = data.job_details.skills.map(each =>
        this.skillFormat(each),
      )
      const similarJobs = data.similar_jobs.map(each =>
        this.formateJobsData1(each),
      )
      this.setState({jobDetails, lifeDetails, skillData, similarJobs})
    } else {
      this.setState({isApi: true})
    }
  }

  render() {
    const {jobDetails, lifeDetails, skillData, similarJobs, isApi} = this.state
    const {
      companyWebsiteUrl,
      companyLogoUrl,
      jobDescription,
      title,
      rating,
      location,
      packagePerAnnum,
      employmentType,
    } = jobDetails
    const {description, imageUrl} = lifeDetails
    return (
      <>
        {isApi ? (
          this.apiFalse()
        ) : (
          <div>
            <div className="jobCardDiv1" testid="loader">
              <div className="div5">
                <img
                  src={companyLogoUrl}
                  className="img11"
                  alt="website logo"
                />
                <div className="div6">
                  <h1 className="h5">{title}</h1>
                  <div className="div7">
                    <BsStarFill className="sort-by-icon" />
                    <p className="p2">{rating}</p>
                  </div>
                </div>
              </div>
              <div className="div8">
                <div className="div10">
                  <div className="div9">
                    <MdLocationOn className="sort-by-icon1" />
                    <p>{location}</p>
                  </div>
                  <div className="div9">
                    <FaShoppingBag className="sort-by-icon1" />
                    <p>{employmentType}</p>
                  </div>
                </div>
                <p>{packagePerAnnum}</p>
              </div>
              <hr />
              <h1 className="p3">Description</h1>
              <a href={companyWebsiteUrl}>Visit</a>
              <p>{jobDescription}</p>
              <h1>Skills</h1>
              <ul className="skillSubDiv">
                {skillData.map(each => (
                  <Skill each={each} />
                ))}
              </ul>
              <h1>Life at Company</h1>
              <div className="lifeDiv">
                <p className="p9">{description}</p>
                <img src={imageUrl} className="img9" alt="life at company" />
              </div>
              <h1>Similar Jobs</h1>
              <ul className="similarDiv">
                {similarJobs.map(each => (
                  <SimilarJobs each={each} />
                ))}
              </ul>
            </div>
          </div>
        )}
      </>
    )
  }
}
export default SelectedJob
