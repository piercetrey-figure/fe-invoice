import PropTypes from "prop-types";
import {EXPLORER_URL} from "consts";

const AddressLink = ({
    address,
    altText,
    showAddressText,
}) => <div>
        <a
            href={`${EXPLORER_URL}/accounts/${address}`}
            target="_blank"
            rel="noreferrer"
        >
            {showAddressText ? "Address: " : ""}
            {altText ? altText : address}
        </a>
    </div>;

AddressLink.propTypes = {
    className: PropTypes.string,
    address: PropTypes.string.isRequired,
    altText: PropTypes.string,
    showAddressText: PropTypes.bool,
};

AddressLink.defaultProps = {
    className: "",
    altText: null,
    showAddressText: true,
};

export default AddressLink;
