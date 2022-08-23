import {
  ListingAdded as NewListingEvent,
  NewOffer,
  NewSale as NewSaleEvent,
} from "../../generated/Marketplace/Marketplace";
import { Listing, Sale, User, Currency, Asset } from "../../generated/schema";
import {
  fetchDecimals,
  fetchName,
  fetchSymbol,
  getTokenUri,
  normalize,
} from "../helpers";

export function handleNewListing(event: NewListingEvent): void {
  let listing = Listing.load(event.params.listingId.toString());

  if (!listing) {
    listing = new Listing(event.params.listingId.toString());
  }

  listing.lister = event.params.lister.toHexString();
  listing.assetContract = event.params.assetContract.toHexString();
  listing.tokenId = event.params.listing.tokenId;
  listing.startTime = event.params.listing.startTime;
  listing.endTime = event.params.listing.endTime;
  listing.quantity = event.params.listing.quantity;
  listing.currency = event.params.listing.currency.toHexString();
  listing.reservePricePerToken = event.params.listing.reservePricePerToken;
  listing.buyoutPricePerToken = event.params.listing.buyoutPricePerToken;
  listing.tokenType =
    event.params.listing.tokenType.toString() == "0" ? "ERC1155" : "ERC721";
  listing.listingType =
    event.params.listing.listingType.toString() == "0" ? "Direct" : "Auction";
  listing.timestamp = event.block.timestamp;

  // fetch asset metadata info
  let id =
    event.params.assetContract.toHexString() +
    "-" +
    event.params.listing.tokenId.toString();
  let asset = Asset.load(id);
  if (!asset) {
    asset = new Asset(event.params.listing.tokenId.toString());
    let uri = getTokenUri(
      event.params.assetContract,
      event.params.listing.tokenId
    );
    asset.uri = normalize(uri);
    asset.assetContract = event.params.assetContract.toHexString();
    asset.tokenId = event.params.listing.tokenId;

    asset.save();
  }

  listing.asset = asset.id;
  listing.save();

  let tokenOwner = User.load(event.params.listing.tokenOwner.toHexString());
  if (!tokenOwner) {
    tokenOwner = new User(event.params.listing.tokenOwner.toHexString());
    tokenOwner.save();
  }

  let currency = Currency.load(event.params.listing.currency.toHexString());
  if (!currency) {
    currency = new Currency(event.params.listing.currency.toHexString());

    currency.name = normalize(fetchName(event.params.listing.currency));
    currency.symbol = normalize(fetchSymbol(event.params.listing.currency));
    currency.decimals = fetchDecimals(event.params.listing.currency);

    currency.save();
  }
}

export function handleNewSale(event: NewSaleEvent): void {
  let sale = Sale.load(event.params.listingId.toString());

  if (!sale) {
    sale = new Sale(event.params.listingId.toString());
  }

  sale.listingId = event.params.listingId;
  sale.assetContract = event.params.assetContract.toHexString();
  sale.lister = event.params.lister.toHexString();
  sale.buyer = event.params.buyer.toHexString();
  sale.quantityBought = event.params.quantityBought;
  sale.totalPricePaid = event.params.totalPricePaid;
  sale.timestamp = event.block.timestamp;

  sale.save();

  let lister = User.load(event.params.lister.toHexString());
  if (!lister) {
    lister = new User(event.params.lister.toHexString());
    lister.save();
  }

  let buyer = User.load(event.params.buyer.toHexString());
  if (!buyer) {
    buyer = new User(event.params.buyer.toHexString());
    buyer.save();
  }
}
